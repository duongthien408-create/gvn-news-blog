# PowerShell script để chạy migration và seed videos
# Usage: .\run-migration.ps1

Write-Host "🚀 Starting Database Setup..." -ForegroundColor Green
Write-Host ""

# Change to backend directory
Set-Location -Path "backend"

# Step 1: Run migration
Write-Host "📝 Step 1: Running migration to add video fields..." -ForegroundColor Cyan
go run . --migrate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Migration failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Seed videos
Write-Host "📹 Step 2: Inserting 30 video samples..." -ForegroundColor Cyan
go run . --seed-videos
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Video seeding failed!" -ForegroundColor Red
    exit 1
}
Write-Host ""

Write-Host "✅ Database setup complete!" -ForegroundColor Green
Write-Host "🎉 30 video posts đã được thêm vào database!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Vào Supabase để xem data: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/editor" -ForegroundColor White
Write-Host "  2. Start backend: go run ." -ForegroundColor White
Write-Host "  3. Mở frontend để xem video hiển thị" -ForegroundColor White

# Go back to root
Set-Location -Path ".."
