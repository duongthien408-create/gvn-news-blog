# PowerShell script to insert E-Dra video
$env:PGPASSWORD = "Gearvn#2025"

psql -h aws-0-ap-southeast-1.pooler.supabase.com `
     -p 5432 `
     -U postgres.qibhlrsdykpkbsnelubz `
     -d postgres `
     -f database/insert-edra-keyboard-video.sql
