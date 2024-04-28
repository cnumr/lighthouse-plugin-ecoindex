echo "updateContentCommand STARTING ⏳"
echo "install lhci"
npm install -g @lhci/cli@0.12.0
echo "install lighthouse"
npm install -g lighthouse
echo "install puppeteer browsers"
npx puppeteer browsers install chrome@121.0.6167.85 -y
echo "chmod 666 /var/run/docker.sock"
sudo chmod 666 /var/run/docker.sock
cd /workspace/lighthouse-plugin-ecoindex && npm link
echo "install http-server"
npm install --global http-server
echo "install retypeapp"
npm install retypeapp --global
echo "WARN: retype is not working in devcontainer!"
echo "updateContentCommand ENDED 🎉"

sudo sh /workspace/.devcontainer/simpleContainer/updateContentCommand/install-chrome.sh
sudo sh /workspace/.devcontainer/simpleContainer/updateContentCommand/install-git-lfs.sh