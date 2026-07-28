@echo off
set PATH=C:\Program Files\dotnet;%PATH%
set DOTNET_ROOT=C:\Program Files\dotnet
cd /d "%~dp0"
echo Starting HMS User/Public API on http://localhost:5000...
"C:\Program Files\dotnet\dotnet.exe" publish\api\API.dll
