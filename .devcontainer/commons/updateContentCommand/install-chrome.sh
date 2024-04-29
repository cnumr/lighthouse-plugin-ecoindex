echo "Chrome installation STARTING ⏳"
apt-get update --fix-missing && apt-get -y upgrade && apt-get install -y git wget gnupg && apt-get clean

wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg
sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list'
apt-get update
apt-get install google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 -y --no-install-recommends
rm -rf /var/lib/apt/lists/*
echo "Chrome installation ENDED 🎉"