npm install
# NODE_PATH=.. npx lighthouse -- https://ecoindex.fr --plugins=lighthouse-plugin-example --only-categories=lighthouse-plugin-example --view
NODE_PATH=.. lighthouse --chrome-flags="--headless" https://www.ecoindex.fr/ --plugins=lighthouse-plugin-ecoindex --only-categories=lighthouse-plugin-ecoindex --view