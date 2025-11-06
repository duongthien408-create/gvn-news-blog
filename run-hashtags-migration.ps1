# PowerShell script to create hashtags and categories tables in Supabase

$env:PGPASSWORD = "Gearvn#2025"

$connectionString = "postgresql://postgres.qibhlrsdykpkbsnelubz:Gearvn#2025@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres"

Write-Host "Creating hashtags and categories tables in Supabase..." -ForegroundColor Cyan

psql $connectionString -f "database\create_hashtags_categories.sql"

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Tables created successfully!" -ForegroundColor Green
} else {
    Write-Host "`n❌ Failed to create tables" -ForegroundColor Red
    exit 1
}

# Verify tables were created
Write-Host "`nVerifying hashtags table..." -ForegroundColor Cyan
psql $connectionString -c "SELECT COUNT(*) FROM hashtags;"

Write-Host "`nVerifying categories table..." -ForegroundColor Cyan
psql $connectionString -c "SELECT COUNT(*) FROM categories;"

Write-Host "`n✅ Migration complete!" -ForegroundColor Green
