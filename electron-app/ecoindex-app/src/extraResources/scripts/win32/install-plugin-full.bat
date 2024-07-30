echo "Install puppeteer browser and plugin launched 🚀"

echo "Installation of Puppetter/Chrome Browser v121.0.6167.85"
npx puppeteer browsers install chrome@121.0.6167.85 > /dev/null 2>&1
echo "Installation of the plugin Lighthouse-ecoindex"
npm install -g lighthouse-plugin-ecoindex@latest > /dev/null 2>&1

echo "Install puppeteer browser and plugin done. 🎉"