@echo off
chcp 65001 >nul
title OpenClaw 网关
echo ========================================
echo   OpenClaw 网关启动中...
echo ========================================
echo.
set OPENROUTER_API_KEY=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
openclaw gateway run --port 18789 --auth none
echo.
echo 网关已停止
pause
