Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
pasta = fso.GetParentFolderName(WScript.ScriptFullName)
shell.Run "cmd.exe /c """ & pasta & "\ATUALIZAR_APP.bat"""", 1, False
