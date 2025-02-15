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
:::code source="../../lighthouse-plugin-ecoindex/helpers/.puppeteerrc.cjs" :::
===
