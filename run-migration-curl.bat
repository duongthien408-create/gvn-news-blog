@echo off
echo ========================================
echo   DATABASE MIGRATION (Using Supabase API)
echo ========================================
echo.

set SUPABASE_URL=https://qibhlrsdykpkbsnelubz.supabase.co
set SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpYmhscnNkeWtwa2JzbmVsdWJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDc4NzEsImV4cCI6MjA3NzkyMzg3MX0.jmwZ8r_7dC8fU5hIlgXrFZUpJBxE07bZyBEuLoG1SrM

echo [INFO] Please run the SQL files manually on Supabase Dashboard:
echo.
echo Step 1: Go to https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/sql/new
echo.
echo Step 2: Copy content from: database\01-add-video-fields.sql
echo         Paste and click "Run"
echo.
echo Step 3: Copy content from: database\02-insert-sample-videos.sql
echo         Paste and click "Run"
echo.
echo Step 4: Verify - You should see 30 video posts in the posts table
echo.
echo ========================================
echo.

start https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/sql/new

echo Browser opened. Please follow the steps above.
echo.
pause
