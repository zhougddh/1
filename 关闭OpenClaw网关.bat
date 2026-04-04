@echo off
chcp 65001 >nul
title 关闭 OpenClaw 网关
echo ========================================
echo   正在关闭 OpenClaw 网关...
echo ========================================
echo.
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :18789 ^| findstr LISTENING') do (
    echo 发现网关进程 PID: %%a
    taskkill /F /PID %%a
    echo.
    echo 网关已成功关闭！
)
if errorlevel 1 (
    echo 未找到运行中的网关进程
)
echo.
pause
