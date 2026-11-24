/* 志愿星图 · 推荐与数据查询引擎（无第三方依赖） */
(function (root) {
  'use strict';

  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

  function getProvince(data, provinceId) {
    return (data.provinces || []).find((p) => p.id === provinceId) || data.provinces[0];
  }

  function getTrack(province, trackId) {
    return (province.tracks || []).find((t) => t.id === trackId) || province.tracks[0];
  }

  function getRows(data, schoolId, provinceId, trackId) {
    const raw = data.admissions &&
      data.admissions[String(schoolId)] &&
      data.admissions[String(schoolId)][provinceId] &&
      data.admissions[String(schoolId)][provinceId][trackId];
    if (!raw || !raw.length) return [];
    const province = getProvince(data, provinceId);
    const track = getTrack(province, trackId);
    return raw.map((row) => {
      const year = String(row[0]);
      const linePair = track.years[year] || [null, null];
      return {
        year: row[0],
        min: row[1],
        avg: row.length > 2 ? row[2] : null,
        rank: row.length > 3 ? row[3] : null,
        plan: row.length > 4 ? row[4] : null,
        line: row.length > 5 && row[5] != null ? row[5] : linePair[0],
        special: row.length > 6 && row[6] != null ? row[6] : linePair[1],
      };
    });
  }

  function getMajors(data, schoolId, provinceId, trackId) {
    const raw = data.majors &&
      data.majors[String(schoolId)] &&
      data.majors[String(schoolId)][provinceId] &&
      data.majors[String(schoolId)][provinceId][trackId];
    if (!raw || !raw.length) return [];
    return raw.map((row) => ({
      group: row[0] || '',
      name: row[1] || '',
      min: row[2],
      avg: row[3],
      rank: row[4],
      plan: row[5],
      subject: row[6] || '',
      year: 2025,
    })).filter((major) => major.name && major.min != null);
  }

  /**
   * 由分数估算位次。使用“批次线—特控线—高分段”的分段单调映射，
   * 与内置样本数据使用同一套口径。
   */
  function estimateRank(province, track, score) {
    const maxScore = province.maxScore;
    const candidates = track.candidates || 1;
    const line = track.years['2025'][0] || 0;
    const special = track.years['2025'][1] || line + 60;
    const s = clamp(Number(score) || 0, 0, maxScore);

    // 优先使用官方一分一段表（2025），比公式估算准确得多。
    if (Array.isArray(track.rankTable) && track.rankTable.length) {
      const table = track.rankTable;
      if (s >= table[0][0]) return 1;
      for (let i = 0; i < table.length; i += 1) {
        if (table[i][0] <= s) return Math.max(1, table[i][1]);
      }
      return Math.max(1, table[table.length - 1][1]);
    }

    let rank;
    if (s >= special) {
      const ratio = (maxScore - s) / Math.max(1, maxScore - special);
      rank = 0.075 * candidates * Math.pow(ratio, 4) + 1;
    } else if (s >= line) {
      const t = (s - line) / Math.max(1, special - line);
      rank = 0.48 * candidates - t * (0.48 - 0.075) * candidates;
    } else {
      const t = clamp((s - (line - 80)) / 80, 0, 1);
      rank = 0.48 * candidates + t * (0.78 - 0.48) * candidates;
    }
    return Math.max(1, Math.min(candidates, Math.round(rank)));
  }

  function admissionProbability(rows, score, strength) {
    if (!rows.length) return 0;
    const weights = { 2025: 0.5, 2024: 0.32, 2023: 0.18 };
    let total = 0;
    let used = 0;
    let latest = rows[0];
    let oldest = rows[rows.length - 1];
    rows.forEach((row) => {
      const w = weights[row.year] || 0.12;
      total += row.min * w;
      used += w;
    });
    const avgMin = total / Math.max(0.01, used);
    const trend = (latest.min || 0) - (oldest.min || 0);
    const sigma = 9.5 + (100 - (strength || 65)) * 0.15;
    const adjusted = Number(score) - avgMin - trend * 0.22;
    const p = 1 / (1 + Math.exp(-adjusted / sigma));
    return {
      probability: clamp(p, 0.01, 0.99),
      avgMin,
      trend,
      sigma,
    };
  }

  function majorProbability(major, score, strength) {
    const sigma = 8.5 + (100 - (strength || 65)) * 0.12;
    const p = 1 / (1 + Math.exp(-(Number(score) - major.min) / sigma));
    return {
      probability: clamp(p, 0.01, 0.99),
      avgMin: major.min,
      trend: 0,
      sigma,
    };
  }

  function tierOf(probability) {
    if (probability < 0.35) return { id: 'reach', label: '冲刺' };
    if (probability < 0.72) return { id: 'match', label: '稳妥' };
    return { id: 'safe', label: '保底' };
  }

  /**
   * 生成 96 个志愿：
   * 1. 先计算每所院校的录取概率；
   * 2. 选取与“考生分数 - 8”最接近的 96 所，避免出现大量明显不匹配的院校；
   * 3. 最终严格按录取概率从低到高排序，形成“冲刺 → 稳妥 → 保底”的梯度。
   */
  function recommend(data, options) {
    const province = getProvince(data, options.provinceId);
    const track = getTrack(province, options.trackId);
    const maxScore = province.maxScore;
    const score = clamp(Number(options.score) || 0, 0, maxScore);
    const limit = options.count || 96;
    const target = score - 8;
    const items = [];
    const line = track.years['2025'] ? track.years['2025'][0] : null;
    const special = track.years['2025'] ? track.years['2025'][1] : null;

    // 优先按“院校 + 专业组 + 专业”生成 96 个专业志愿。
    (data.schools || []).forEach((school) => {
      const majors = getMajors(data, school.id, province.id, track.id);
      majors.forEach((major) => {
        const stat = majorProbability(major, score, school.strength);
        const latest = {
          year: 2025, min: major.min, avg: major.avg, rank: major.rank,
          plan: major.plan, line, special,
        };
        items.push({
          key: school.id + '|' + major.group + '|' + major.name,
          school,
          major,
          rows: [latest],
          latest,
          oldest: latest,
          avgMin: major.min,
          trend: 0,
          sigma: stat.sigma,
          probability: stat.probability,
          distance: Math.abs(major.min - target),
        });
      });
    });

    // 极少数学校没有分专业数据时，退回院校级记录，保证页面可用。
    if (!items.length) {
      (data.schools || []).forEach((school) => {
        const rows = getRows(data, school.id, province.id, track.id);
        if (!rows.length || rows[0].year !== 2025) return;
        const stat = admissionProbability(rows, score, school.strength);
        items.push({
          key: 'school-' + school.id,
          school,
          major: null,
          rows,
          latest: rows[0],
          oldest: rows[rows.length - 1],
          avgMin: stat.avgMin,
          trend: stat.trend,
          sigma: stat.sigma,
          probability: stat.probability,
          distance: Math.abs(stat.avgMin - target),
        });
      });
    }

    // 用 5%–95% 的概率目标生成平滑梯度，并限制每校最多 2 个专业。
    const targets = Array.from({ length: limit }, (_, index) => 0.05 + 0.9 * Math.pow(index / Math.max(1, limit - 1), 1.15));
    const chosen = [];
    const chosenKeys = new Set();
    const perSchool = {};
    const pickForTarget = (target, cap) => {
      let best = null;
      let bestDelta = Infinity;
      items.forEach((item) => {
        if (chosenKeys.has(item.key)) return;
        const sid = item.school.id;
        if ((perSchool[sid] || 0) >= cap) return;
        const delta = Math.abs(item.probability - target);
        if (delta < bestDelta) {
          best = item;
          bestDelta = delta;
        }
      });
      if (best) {
        chosen.push(best);
        chosenKeys.add(best.key);
        perSchool[best.school.id] = (perSchool[best.school.id] || 0) + 1;
      }
    };
    targets.forEach((target) => {
      const before = chosen.length;
      pickForTarget(target, 2);
      if (chosen.length === before) pickForTarget(target, 99);
    });
    if (chosen.length < limit) {
      const rest = items.filter((item) => !chosenKeys.has(item.key)).sort((a, b) => a.distance - b.distance);
      rest.forEach((item) => {
        if (chosen.length >= limit) return;
        chosen.push(item);
        chosenKeys.add(item.key);
      });
    }

    const picked = chosen;
    picked.forEach((item) => {
      let tier;
      if (item.probability < 0.35) tier = { id: 'reach', label: '冲刺' };
      else if (item.probability < 0.72) tier = { id: 'match', label: '稳妥' };
      else tier = { id: 'safe', label: '保底' };
      item.tier = tier.id;
      item.tierLabel = tier.label;
      item.percent = Math.round(item.probability * 100);
      item.percent = clamp(item.percent, 1, 99);
    });
    picked.sort((a, b) => a.probability - b.probability || b.avgMin - a.avgMin || a.school.name.localeCompare(b.school.name, 'zh-Hans-CN'));

    const counts = { reach: 0, match: 0, safe: 0 };
    picked.forEach((item) => { counts[item.tier] += 1; });

    return {
      province,
      track,
      score,
      maxScore,
      studentRank: estimateRank(province, track, score),
      items: picked,
      counts,
      totalCandidates: items.length,
      generatedAt: new Date().toISOString(),
    };
  }

  function bestSchoolFor(data, school, provinceId, trackId) {
    return getRows(data, school.id, provinceId, trackId);
  }

  function formatNumber(n) {
    if (n === null || n === undefined || Number.isNaN(Number(n))) return '—';
    return Number(n).toLocaleString('zh-CN');
  }

  function pct(n) {
    return Math.max(1, Math.min(99, Math.round(n * 100)));
  }

  const api = {
    clamp,
    getProvince,
    getTrack,
    getRows,
    getMajors,
    estimateRank,
    admissionProbability,
    majorProbability,
    recommend,
    bestSchoolFor,
    formatNumber,
    pct,
    tierOf,
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.GKEngine = api;
})(typeof window !== 'undefined' ? window : globalThis);
