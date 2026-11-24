# 志愿星图 · 高考志愿智能填报助手

一个纯前端离线的高考志愿测算工具：输入分数与省份，基于 **2023–2025 年真实公开录取数据**生成最多 96 个专业志愿，按「冲刺 / 稳妥 / 保底」排序。双击快捷方式即可运行，主软件无需安装 Node / Python。

## 数据口径（重点）

| 数据 | 来源 | 覆盖 |
|---|---|---|
| 2025 院校级 + 分专业 | 掌上高考公开录取数据（经公开爬虫项目汇总） | 31 省、1,286 所本科、**66,990 条**专业记录 |
| 2023–2024 院校级 | GaokaoCompass 对各省教育考试院公开投档线的整理 | 22 / 17 个省份（质量合格才纳入） |
| 2025 一分一段 / 批次线 | GaokaoCompass `score-range.csv` / `meta.json` | 位次换算与本科线 |

- 已尽量只保留普通类、本科批，排除提前批、专项计划、中外合作等特殊类型；
- **缺失值显示「—」，不用模拟值填充**，保证口径可追溯；
- 录取概率为估算值，不是官方录取结论；正式填报以各省教育考试院、招生计划汇编和高校招生章程为准。

## 功能

- 默认游客模式，无登录墙：启动先进入选择页，可直接进入首页生成志愿
- 输入分数与省份 → 生成最多 **96 个专业志愿**（院校 + 专业组 + 专业）
- 排序：冲刺 → 稳妥 → 保底；**每校最多保留 2 个专业**，避免过度集中
- 院校详情支持切换省份与选科类别，查看 2025 年分专业录取表、历年分数、位次、线差与趋势
- 筛选 / 搜索游客可用；收藏与打印登录后使用
- 可选管理员登录（密码为账号后四位，SHA-256 校验）

## 界面

![选择页](预览_选择页.png)
![功能页](预览_功能页.png)

## 快速开始

双击 `启动.vbs`（用 Chrome / Edge 的应用模式打开），或直接用浏览器打开 `index.html`。

兼容性：Chrome / Edge 现代版本；使用 `file://` 离线运行；仅面向电脑端。

## 数据结构（简版）

```js
window.GK_DATA = {
  meta: { years, schoolCount, provinceCount, recordCount, majorCount, dataSources },
  provinces: [{ id, name, mode, tracks: [{ id, name, rankTable, years }] }],
  schools: [{ id, name, province, city, type, level, tags, strength, nature }],
  admissions: { schoolId: { provinceId: { trackId: [[year, min, avg, rank, plan, line, special]] } } },
  majors: { schoolId: { provinceId: { trackId: [[专业组, 专业名, 最低分, 平均分, 最低位次, 录取人数, 选科要求]] } } }
};
```

## 目录

```
index.html
assets/
  app.css      界面
  app.js       交互
  engine.js    位次换算 / 概率 / 专业志愿选择
  data.js      整理后的真实公开数据
启动.vbs       使用 Chrome/Edge 的应用模式启动
使用说明.txt   账号与操作说明
```

## 数据再生成

开发环境（需要 pandas）运行 `python build_real_data.py` 重新生成数据。原始下载数据体积较大，不随仓库提供。
