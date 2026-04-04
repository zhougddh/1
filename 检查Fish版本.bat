@echo off
echo ========================================
echo      检查 Fish Shell 版本
echo ========================================
echo.
echo 正在检查 Fish Shell 是否安装...
echo.

fish --version >nul 2>&1
if %errorlevel% equ 0 (
    echo [成功] Fish Shell 已安装！
    echo.
    fish --version
) else (
    echo [错误] Fish Shell 未安装或不在 PATH 中
    echo.
    echo 请按照以下步骤安装 Fish Shell:
    echo 1. 下载 MSYS2: https://www.msys2.org/
    echo 2. 安装 MSYS2 到 C:\msys64
    echo 3. 打开 MSYS2 终端，运行: pacman -S fish
    echo 4. 安装完成后重新运行此脚本
)

echo.
pause
