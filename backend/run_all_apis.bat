@echo off
echo ===================================================
echo   Starting Hospital Management System Backend APIs
echo ===================================================
echo.
echo 1. Starting Public/User API (http://localhost:5000)...
start "HMS Public/User API (Port 5000)" cmd /k "cd /d %~dp0 && dotnet run --project src/API/API.csproj"

echo 2. Starting Admin API (http://localhost:5001)...
start "HMS Admin API (Port 5001)" cmd /k "cd /d %~dp0 && dotnet run --project src/Admin.API/Admin.API.csproj"

echo.
echo Both API projects are launching in separate console windows!
echo - Public/User API Swagger: http://localhost:5000/swagger
echo - Admin API Swagger: http://localhost:5001/swagger
echo.
