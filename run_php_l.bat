@echo off
cd /d "%~dp0"
php -l "Backend/app/Http/Controllers/API/AuthController.php"
php -l "Backend/routes/api.php"

