@echo off
set PATH=C:\Program Files\dotnet;%PATH%
set DOTNET_ROOT=C:\Program Files\dotnet
"C:\Program Files\dotnet\dotnet.exe" run --project src/API/API.csproj --launch-profile http
