@echo off
echo Updating portfolio projects and solutions...
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0update-site.ps1"
echo.
echo Now refresh the website in your browser (Ctrl + F5).
pause
