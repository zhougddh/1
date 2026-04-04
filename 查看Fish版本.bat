@echo off
title 检查 Fish Shell 版本
color 0A
echo ========================================
echo      检查 Fish Shell 版本
echo ========================================
echo.

:: 检查 PowerShell 是否可用
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 无法找到 PowerShell
    pause
    exit /b 1
)

:: 运行 PowerShell 脚本
powershell -ExecutionPolicy Bypass -File "%~dp0检查Fish版本.ps1"

exit /b 0
