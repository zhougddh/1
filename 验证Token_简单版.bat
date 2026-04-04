@echo off
chcp 65001 >nul
title 验证 Fish Audio Token
color 0A
cls
echo ========================================
echo      验证 Fish Audio Token
echo ========================================
echo.
echo Token: 03061fd2233d46ea9c8b715edd4cc64a
echo.
echo 正在验证 Token，请稍候...
echo.

powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0验证FishToken.ps1"

echo.
echo ========================================
echo.
echo 按任意键退出...
pause >nul
