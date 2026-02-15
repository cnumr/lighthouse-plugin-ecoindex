---
label: Configurations avancées
icon: zap
order: 600
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

## Audit d'un site à accès sécurisé avec le module d'authentification intégré

Le plugin integre un module d'authentification simple qui permet de se connecter à une page d'authentification classique (ex. WordPress, Prestashop, etc.) avant de lancer les mesures d'EcoIndex. Si cela ne correspond pas à votre besoin, vous pouvez utiliser un fichier de script Puppeteer custom pour réaliser les étapes d'authentification et de navigation avant de lancer les mesures d'EcoIndex.  
[!ref icon="unlock" text="Mesure avec une authentification complexe"](./10-custom-puppeteer-script.md)

!!!warning
La page d'authentifcation doit faire partie de la liste de page à mesurer.  
Due à une limitation de Lighthouse, **on ne peut pas mesurer plusieurs fois la même url**. Le workaround est d'appeler les urls avec des faux paramètres de navigation, ex. https://greenit.eco/?test=123 et https://greenit.eco/ pour les différencier.
!!!

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

## Utilisation d'un fichier de script Puppeteer custom

[!ref icon="unlock" text="Mesure avec une authentification complexe"](./10-custom-puppeteer-script.md)
