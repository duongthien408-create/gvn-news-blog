@echo off
echo ========================================
echo   DATABASE MIGRATION AND SEEDING
echo ========================================
echo.

cd backend

echo [Step 1/2] Running migration to add video fields...
echo.
go run . --migrate
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Migration failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo.

echo [Step 2/2] Inserting 30 video samples...
echo.
go run . --seed-videos
if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Video seeding failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo   SUCCESS! DATABASE SETUP COMPLETE
echo ========================================
echo.
echo 30 video posts have been added to your database!
echo.
echo Next steps:
echo   1. Check Supabase: https://supabase.com/dashboard/project/qibhlrsdykpkbsnelubz/editor
echo   2. Start backend: go run .
echo   3. Open frontend to see videos
echo.
pause
