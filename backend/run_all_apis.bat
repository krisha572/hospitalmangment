@echo off
echo ===================================================
echo   Starting Hospital Management System Backend APIs
echo ===================================================
echo.
echo 1. Starting Public/User API (http://localhost:5000)...
start "HMS Public/User API (Port 5000)" cmd /k "cd /d %~dp0 && run_user_api.bat"

echo 2. Starting Admin API (http://localhost:5001)...
start "HMS Admin API (Port 5001)" cmd /k "cd /d %~dp0 && run_admin_api.bat"

echo.
echo Both API projects are launching in separate console windows!
echo - Public/User API Swagger: http://localhost:5000/swagger
echo - Admin API Swagger: http://localhost:5001/swagger
echo.
