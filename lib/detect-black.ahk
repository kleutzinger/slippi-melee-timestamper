#NoEnv ; Recommended for performance and compatibility with future AutoHotkey releases.
#SingleInstance, Force

; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir% ; Ensures a consistent starting directory.

SetTitleMatchMode 1
url:= "http://localhost:7789/ahk_post"
body = {"dolphin_state": "no"}

; If WinExist("Faster.*Playback"){
If WinExist("Faster"){
  ; how tf to get this working?????
  ; ToolTip, "dolphin is running"
  CoordMode, Pixel, Screen
  
  WinGetPos, X, Y, Width, Height,
  ; MsgBox, X %X% Y %Y% WxH: %Width%x%Height%
  centerx := (X + Width/2)
  centery := (Y + Height/2)
  
  
  PixelGetColor, color, %centerx%, %centery%,
  ToolTip, %color%, %centerx%, %centery%
  body = {"dolphin_state": "running", "center_color": "%color%", "centerx": "%centerx%", "centery": "%centery%"}
}

DllCall("kernel32\AllocConsole")
oFile := FileOpen("*", "w") ;for stdout
oFile.Write("STDOUT: abc`r`ndef`r`nghi")
oFile.Close()

; whr := ComObjCreate("WinHttp.WinHttpRequest.5.1")
; whr.Open("POST", url, true)
; ; whr.SetRequestHeader("User-Agent", User-Agent)
; whr.SetRequestHeader("Content-Type", "application/json")
; ; whr.SetRequestHeader("Cookie", Cookie)

; whr.Send(body)

; whr.WaitForResponse()

; ^!z:: ; Control+Alt+Z hotkey.
; MouseGetPos, MouseX, MouseY
; PixelGetColor, color, %MouseX%, %MouseY%
; MsgBox The color at the current cursor position is %color%.
; return