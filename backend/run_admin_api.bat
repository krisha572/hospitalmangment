@echo off
set PATH=C:\Program Files\dotnet;%PATH%
set DOTNET_ROOT=C:\Program Files\dotnet
cd /d "%~dp0"
echo Starting HMS Admin API on http://localhost:5001...
"C:\Program Files\dotnet\dotnet.exe" publish\adminapi\Admin.API.dll
