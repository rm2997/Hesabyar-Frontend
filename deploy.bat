@echo off
setlocal

set DEPLOY_DIR=..\hesabyaar_front_deploy

echo Start deploying...

for /f %%i in ('powershell -NoProfile -Command "Get-Date -Format yyyy-MM-dd_HHmmss"') do set pattern=%%i

move .\build ..\build_%pattern%

call npm run build

rmdir /s /q %DEPLOY_DIR%
mkdir %DEPLOY_DIR%

echo Start copying...

xcopy /E /I /Y build %DEPLOY_DIR%\
copy package.json %DEPLOY_DIR%\
copy package-lock.json %DEPLOY_DIR%\

if exist .env (
  copy .env %DEPLOY_DIR%\
)


echo Compressing deploy...

powershell -NoProfile -Command "Compress-Archive -Path '%DEPLOY_DIR%\*' -DestinationPath '%DEPLOY_DIR%_%pattern%.zip'"

echo Deploying finished...

endlocal
