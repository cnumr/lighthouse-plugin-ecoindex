FROM mcr.microsoft.com/devcontainers/javascript-node:0-20

ENV CHROME_PATH /usr/bin/google-chrome-stable

# Install Lighthouse CI
RUN npm install -g @lhci/cli@0.12.0
RUN npm install -g lighthouse

# Install puppeteer
RUN npm install -g puppeteer
RUN npx puppeteer browsers install chrome