@echo off
echo ============================================
echo    Women's Safety App - ngrok Setup
echo ============================================
echo.
echo IMPORTANT: Get your ngrok token first!
echo.
echo 1. Open this link (opening now...):
echo    https://dashboard.ngrok.com/get-started/your-authtoken
echo.
echo 2. Sign up/login (FREE!)
echo 3. Copy your authtoken
echo 4. Come back here and paste it
echo.
start https://dashboard.ngrok.com/get-started/your-authtoken
echo.
echo Press any key after you have your token ready...
pause
echo.
set /p NGROK_TOKEN="Paste your ngrok token here: "

echo.
echo Installing token...
ngrok.exe config add-authtoken %NGROK_TOKEN%

echo.
echo ============================================
echo Starting ngrok tunnel on port 8080...
echo ============================================
echo.
echo YOUR PUBLIC URL WILL APPEAR BELOW!
echo Look for "Forwarding" line with https://...
echo.
echo Keep this window open!
echo Press Ctrl+C to stop when done.
echo.

ngrok.exe http 8080
