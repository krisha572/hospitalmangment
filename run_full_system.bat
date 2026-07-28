@echo off
echo ===================================================================
echo   Hospital Management System - Starting Frontend & Both Backend APIs
echo ===================================================================
echo.
echo 1. Starting Public/User API (http://localhost:5000)...
start "HMS Public API (Port 5000)" cmd /k "cd /d %~dp0backend && run_user_api.bat"

echo 2. Starting Admin API (http://localhost:5001)...
start "HMS Admin API (Port 5001)" cmd /k "cd /d %~dp0backend && run_admin_api.bat"

echo 3. Starting Frontend React App (http://localhost:5173)...
start "HMS React Frontend (Port 5173)" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo All 3 services are launching in separate windows:
echo - Public API: http://localhost:5000/swagger
echo - Admin API:  http://localhost:5001/swagger
echo - Frontend:   http://localhost:5173
echo.
