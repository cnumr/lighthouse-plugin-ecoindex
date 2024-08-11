@echo off
echo "Install puppeteer browser launched 🚀"

REM Install batch
echo "Install puppetter"
call npm install -g puppeteer
echo "Installation of Puppetter/Chrome Browser v121.0.6167.85"
call npx puppeteer browsers install chrome@121.0.6167.85
@REM echo "Installation of the plugin Lighthouse-ecoindex"
@REM call npm install -g lighthouse-plugin-ecoindex@latest

echo "Install puppeteer browser done. 🎉"