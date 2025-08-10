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

### En mode simple (liste d'URLs)

```shell
npx lighthouse-plugin-ecoindex collect -u https://greenit.eco/ -u https://greenit.eco/wp-login.php/ -u https://greenit.eco/wp-admin/plugins.php --auth.url %test_url% --auth.user.target '#user_login' --auth.user.value %username_value% --auth.pass.target '#user_pass' --auth.pass.value %password_value% -o html
```

### En mode mesure de parcours (avec le fichier de config JSON)

!!!warning
La page d'authentiifcation doit faire partie de la liste de page à mesurer, cela pour chaque parcours dont une partie ou la totalité des pages sont sécurisée.
!!!

```json
{
"$schema": "/workspace/docs/static/schema/5.1/schema.json",
  "extra-header": {
    "Cookie": "monster=blue",
    "x-men": "wolverine"
  },
  "output": ["html", "json", "statement"],
  "user-agent": "random",
  "output-path": "./reports/multi",
  "auth": {
    "url": "https://domain.ltd/login/",
    "user": {
      "target": "#user_login",
      "value": "******"
    },
    "pass": {
      "target": "#user_pass",
      "value": "*****"
    }
  },
  "courses": [...]
}
```

==- Modèle de fichier de configuration de Puppeteer (complet) sans authentification
:::code source="../../test/test-ecoindex-lh-plugin-ts/.puppeteerrc.cjs" :::
===

## Utilisation d'un fichier de script Puppeteer custom

!!!info
L'utilisation d'un fichier de script Puppeteer custom est recommandée pour les audits de sites nécessitant une authentification complexe.
!!!

!!!warning
**Points d'attention:**

- Due à une limitation de Lighthouse, **on ne peut pas mesurer plusieurs fois la même url**. Le workaround est d'appeler les urls avec des faux paramètres de navigation, ex. https://greenit.eco/?test=123 pour les différencier.
- Les scénarios complexes avec des pages d'authentifications et des soumissions de formulaires, des pages de redirection, etc. seront mal mesurées (à cause des navigations entre les pages). Il faut donc être vigilant sur les pages à mesurer et ne pas hésiter à ajouter plusieurs pages dans le fichier de configuration en utilisant des faux paramètres de navigation (ex. https://greenit.eco/?test=123).
- Hors des pages d'authentification, les pages doivent être utilisée avec les scénarios de mesure de parcours standards `startEcoindexPageMesure(page, session)` et `endEcoindexPageMesure(flow)`.
  !!!

### Utilisation en ligne de commande

```shell
npx lighthouse-plugin-ecoindex collect -u https://greenit.eco/ -u https://greenit.eco/wp-login.php/ -u https://greenit.eco/wp-admin/plugins.php --puppeteer-script ./puppeteer-script.mjs
```

==- Modèle de fichier de script Puppeteer custom
:::code source="../../test/test-ecoindex-lh-cli/puppeteer-script.mjs" :::
===

### Utilisation avec un fichier de configuration `input-file.json`

```json
{
  // ...
  "puppeteer-script": "./puppeteer-script.mjs"
  // ...
}
```

==- Modèle de fichier de script Puppeteer custom
:::code source="../../test/test-ecoindex-lh-cli/puppeteer-script.mjs" :::
===
