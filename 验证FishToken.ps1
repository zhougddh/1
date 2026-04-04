# 验证 Fish Audio Token
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "      验证 Fish Audio Token" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Token: 03061fd2233d46ea9c8b715edd4cc64a" -ForegroundColor Yellow
Write-Host ""
Write-Host "正在验证 Token，请稍候..." -ForegroundColor Gray
Write-Host ""

try {
    $headers = @{
        "Authorization" = "Bearer 03061fd2233d46ea9c8b715edd4cc64a"
        "Content-Type" = "application/json"
    }
    
    $body = '{"text":"测试"}'
    
    $response = Invoke-WebRequest -Uri "https://api.fish.audio/v1/tts" -Method POST -Headers $headers -Body $body -TimeoutSec 10
    
    Write-Host "状态码: $($response.StatusCode)" -ForegroundColor Green
    Write-Host ""
    Write-Host "✓ Token 验证成功！" -ForegroundColor Green
    Write-Host "✓ Token 有效，可以使用 Fish Audio 服务" -ForegroundColor Green
    
} catch {
    Write-Host "错误: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "状态码: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Red
        Write-Host ""
        Write-Host "✗ Token 无效或已过期" -ForegroundColor Red
        Write-Host "✗ 请检查 Token 是否正确" -ForegroundColor Red
    } else {
        Write-Host ""
        Write-Host "✗ 网络连接失败" -ForegroundColor Red
        Write-Host "✗ 请检查网络连接" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
