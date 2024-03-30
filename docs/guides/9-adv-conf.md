---
label: Configurations avancées
icon: zap
order: 0
---

# Cas d'usages et configurations avancées

## Audit d'un site nécessitant un cookie

> Obligation de créer cookie pour fermer une popin, par exemple.

### Utilisation du fichier `extra-header.json`

```json
{ "Cookie": "monster=blue", "x-men": "wolverine" }
```

### Utilisation du fichier `input-file.json`

```json
{
  "extra-header": {
    "Cookie": "monster=blue",
    "x-men": "wolverine"
  }
  // ...
}
```

## Audit d'un site à accès sécurisé

Utilisation d'un `.puppeteerrc.cjs` custom.

> À adapter suivant le type d'authentification.

```javascript
module.exports = async (browser, context) => {
  // launch browser for LHCI
  const page = await browser.newPage(context.options)
  page.authenticate({ username: '<to adapte>', password: '<to adapte>' })
  const session = await page.target().createCDPSession()
  await page.goto(context.url, { waitUntil: 'networkidle0' })
  await startEcoindexPageMesure(page, session)
  await endEcoindexPageMesure()
  // close session for next run
  await page.close()
}
```
