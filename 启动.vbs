Option Explicit
Dim fso, shell, base, path, url, browser, profile, args, pf, pf86, local

Set fso = CreateObject("Scripting.FileSystemObject")
Set shell = CreateObject("WScript.Shell")

base = fso.GetParentFolderName(WScript.ScriptFullName)
path = Replace(base & "\index.html", "\", "/")

' Chrome 的 --app 参数对含中文的 file:// 地址需要百分号编码，否则会退化成新标签页。
On Error Resume Next
url = "file:///" & UrlEncodePath(path)
If Err.Number <> 0 Then
  Err.Clear
  url = "file:///" & path
End If
On Error GoTo 0

pf = shell.ExpandEnvironmentStrings("%ProgramFiles%")
pf86 = shell.ExpandEnvironmentStrings("%ProgramFiles(x86)%")
local = shell.ExpandEnvironmentStrings("%LOCALAPPDATA%")
browser = ""

If fso.FileExists(pf & "\Google\Chrome\Application\chrome.exe") Then
  browser = pf & "\Google\Chrome\Application\chrome.exe"
ElseIf fso.FileExists(pf86 & "\Google\Chrome\Application\chrome.exe") Then
  browser = pf86 & "\Google\Chrome\Application\chrome.exe"
ElseIf fso.FileExists(local & "\Google\Chrome\Application\chrome.exe") Then
  browser = local & "\Google\Chrome\Application\chrome.exe"
ElseIf fso.FileExists(pf86 & "\Microsoft\Edge\Application\msedge.exe") Then
  browser = pf86 & "\Microsoft\Edge\Application\msedge.exe"
ElseIf fso.FileExists(pf & "\Microsoft\Edge\Application\msedge.exe") Then
  browser = pf & "\Microsoft\Edge\Application\msedge.exe"
ElseIf fso.FileExists(local & "\Microsoft\Edge\Application\msedge.exe") Then
  browser = local & "\Microsoft\Edge\Application\msedge.exe"
End If

If browser <> "" Then
  profile = base & "\browser-data"
  args = "--app=" & Chr(34) & url & Chr(34) & " --user-data-dir=" & Chr(34) & profile & Chr(34) & " --window-size=1440,900 --no-first-run --no-default-browser-check --disable-features=TranslateUI"
  shell.Run Chr(34) & browser & Chr(34) & " " & args, 1, False
Else
  shell.Run "explorer.exe " & Chr(34) & base & "\index.html" & Chr(34), 1, False
End If

Function UrlEncodePath(text)
  Dim bytes, i, b, code, out, start
  bytes = ToUtf8Bytes(text)
  out = ""
  start = 1
  If LenB(bytes) >= 3 Then
    If AscB(MidB(bytes, 1, 1)) = 239 And AscB(MidB(bytes, 2, 1)) = 187 And AscB(MidB(bytes, 3, 1)) = 191 Then start = 4
  End If
  For i = start To LenB(bytes)
    b = AscB(MidB(bytes, i, 1))
    If (b >= 65 And b <= 90) Or (b >= 97 And b <= 122) Or (b >= 48 And b <= 57) Or b = 45 Or b = 46 Or b = 95 Or b = 126 Or b = 47 Or b = 58 Then
      out = out & Chr(b)
    Else
      code = Right("0" & Hex(b), 2)
      out = out & "%" & code
    End If
  Next
  UrlEncodePath = out
End Function

Function ToUtf8Bytes(text)
  Dim stream
  Set stream = CreateObject("ADODB.Stream")
  stream.Type = 2
  stream.Charset = "utf-8"
  stream.Open
  stream.WriteText text
  stream.Position = 0
  stream.Type = 1
  ToUtf8Bytes = stream.Read
  stream.Close
End Function
