# 检查 Fish Shell 版本
Write-Host "正在检查 Fish Shell 版本..." -ForegroundColor Green
Write-Host ""

$version = fish --version 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "Fish Shell 已安装！" -ForegroundColor Green
    Write-Host "版本信息: $version" -ForegroundColor Cyan
} else {
    Write-Host "Fish Shell 未安装或不在 PATH 中" -ForegroundColor Red
    Write-Host ""
    Write-Host "请按照以下步骤安装 Fish Shell:" -ForegroundColor Yellow
    Write-Host "1. 下载 MSYS2: https://www.msys2.org/" -ForegroundColor White
    Write-Host "2. 安装 MSYS2 到 C:\msys64" -ForegroundColor White
    Write-Host "3. 打开 MSYS2 终端，运行: pacman -S fish" -ForegroundColor White
    Write-Host "4. 安装完成后重新运行此脚本" -ForegroundColor White
}

Write-Host ""
Write-Host "按任意键退出..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
