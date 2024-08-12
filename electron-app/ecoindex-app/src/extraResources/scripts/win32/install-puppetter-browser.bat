@echo off
echo "Install puppeteer browser launched 🚀"

REM Install batch
echo "Install puppetter"
call npm install -g puppeteer
echo "Installation of Puppetter/Chrome Browser v121.0.6167.85"
call npx puppeteer browsers install chrome@121.0.6167.85

echo "Install puppeteer browser done. 🎉"