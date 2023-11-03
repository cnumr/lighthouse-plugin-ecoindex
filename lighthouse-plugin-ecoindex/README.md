# lighthouse-plugin-ecoindex

Résumé des resultats
![Résumé des resultats](docs/ecoindex-intro.png)

Détails des résultats du plugin
![Détails des résultats du plugin](docs/ecoindex-results.png)

## Description

This plugin is a wrapper of [ecoindex](https://ecoindex.fr/) for [lighthouse](https://github.com/GoogleChrome/lighthouse/blob/main/docs/plugins.md).

## Objectifs du plugin

Générer un rapport lighthouse avec les mesures ecoindex.

Ces mesures et ce rapport émule le comportement d'un utilisateur sur une page web (voir ci-dessous).

Cette génération de rapport utilise Lighthouse, Puppeteer et le plugin lighthouse Ecoindex.

```
1. Lancer un navigateur Chrome headless avec les options no-sandbox, disable-dev-shm-usage et les capacités goog:loggingPrefs à {"performance": "ALL"}
2. Ouvrir la page sans données locales (cache, cookies, localstorage…) avec une résolution 1920 × 1080px
3. Attendre 3 secondes
4. Scroller en bas de page
5. Attendre de nouveau 3 secondes
6. Fermer la page
```

## Installation

```bash
npm i lighthouse-plugin-ecoindex
```

### 1. Créer ou adapater le fichier `.lighthouserc.json`

> Inspirez-vous de ce contenu.

```json
{
  "ci": {
    "collect": {
      "url": ["https://www.ecoindex.fr/"],
      "numberOfRuns": 1,
      "settings": {
        "puppeteerScript": "./.puppeteerrc.js",
        "puppeteerLaunchOptions": {
          "defaultViewport": {
            "isMobile": false,
            "width": 1920,
            "height": 1080
          },
          "formFactor": "desktop"
        },
        "plugins": ["lighthouse-plugin-ecoindex"],
        "disableStorageReset": true,
        "preset": "desktop",
        "chromeFlags": "--disable-gpu --disable-dev-shm-usage --disable-setuid-sandbox --no-sandbox"
      }
    },
    "assert": {
      "preset": "lighthouse:default"
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

### 2. Créer le fichier `.puppeteerrc.js`

Ajouter ce contenu :

```javascript
// https://pptr.dev/guides/configuration
// https://github.com/GoogleChrome/lighthouse-ci/blob/main/docs/configuration.md#puppeteerscript
/**
 * @param {puppeteer.Browser} browser
 * @param {{url: string, options: LHCI.CollectCommand.Options}} context
 */
module.exports = async (browser, context) => {
  // launch browser for LHCI
  const page = await browser.newPage()
  const session = await page.target().createCDPSession()
  await page.goto(url, { waitUntil: 'networkidle0' })
  await new Promise(r => setTimeout(r, 3 * 1000))
  // We need the ability to scroll like a user. There's not a direct puppeteer function for this, but we can use the DevTools Protocol and issue a Input.synthesizeScrollGesture event, which has convenient parameters like repetitions and delay to somewhat simulate a more natural scrolling gesture.
  // https://chromedevtools.github.io/devtools-protocol/tot/Input/#method-synthesizeScrollGesture
  await session.send('Input.synthesizeScrollGesture', {
    x: 100,
    y: 600,
    yDistance: -2500,
    speed: 1000,
  })
  // await page.click('#didomi-notice-agree-button');
  await new Promise(r => setTimeout(r, 3 * 1000))
  // close session for next run
  await page.close()
}
```
