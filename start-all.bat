@echo off
echo ============================================
echo   Women's Safety App - Starting Everything
echo ============================================
echo.
echo Starting Spring Boot Server...
echo.

REM Start Spring Boot in a new window
start "Spring Boot Server" cmd /k "cd /d d:\womensafetyq\womensafetyq && mvnw.cmd spring-boot:run"

echo Waiting 30 seconds for Spring Boot to start...
timeout /t 30 /nobreak

echo.
echo Starting ngrok tunnel...
echo.

REM Start ngrok in a new window
start "ngrok Tunnel" cmd /k "cd /d d:\womensafetyq\womensafetyq && ngrok.exe http 8080"

echo.
echo ============================================
echo Both services are starting!
echo ============================================
echo.
echo Window 1: Spring Boot Server
echo Window 2: ngrok Tunnel
echo.
echo Check the ngrok window for your public URL!
echo.
pause
