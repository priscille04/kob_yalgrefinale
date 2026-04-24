@echo off
echo ==========================================
echo  Démarrage du serveur KOB-YALGRE Backend
echo ==========================================
echo.
echo Le serveur va ecouter sur toutes les interfaces (0.0.0.0:8000)
echo pour permettre la connexion depuis le telephone (192.168.43.152)
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.
php artisan serve --host=0.0.0.0 --port=8000

