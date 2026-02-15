# Custom Puppeteer Script Example

Suivant votre contexte, il peut être nécessaire de réaliser des audits de sites nécessitant une authentification complexe (ex. WordPress, Prestashop, etc.). Dans ce cas, il est possible d'utiliser un fichier de script Puppeteer custom pour réaliser les étapes d'authentification et de navigation avant de lancer les mesures d'EcoIndex.

> [!warning] > **Points d'attention:**
>
> - Due à une limitation de Lighthouse, **on ne peut pas mesurer plusieurs fois la même url**. Le workaround est d'appeler les urls avec des faux paramètres de navigation, ex. https://greenit.eco/?test=123 et https://greenit.eco/ pour les différencier.
> - Les scénarios complexes avec des pages d'authentifications et des soumissions de formulaires, des pages de redirection, etc. seront mal mesurées (à cause des navigations entre les pages). Il faut donc être vigilant sur les pages à mesurer et ne pas hésiter à ajouter plusieurs pages dans le fichier de configuration en utilisant des faux paramètres de navigation (ex. https://greenit.eco/?test=123).
> - Hors des pages d'authentification, les pages doivent être utilisée avec les scénarios de mesure de parcours standards `startEcoindexPageMesure(page, session)` et `endEcoindexPageMesure(flow)`.
>   !!!

## Utilisation

### Utilisation en ligne de commande

```shell
npx lighthouse-plugin-ecoindex collect -u https://greenit.eco/ -u https://greenit.eco/wp-login.php/ -u https://greenit.eco/wp-admin/plugins.php --puppeteer-script ./puppeteer-script.mjs
```

### Utilisation avec un fichier de configuration `input-file.json`

```json
{
  // ...
  "puppeteer-script": "./puppeteer-script.mjs"
  // ...
}
```

## Exemple de script Puppeteer custom

### Script Puppeteer custom

Modèle de fichier de script Puppeteer custom (index.cjs)

`./custom-puppeteer-script-example/index.cjs`

Modèle de fichier de script Puppeteer custom (suite du fichier index.cjs)

`./custom-puppeteer-script-example/puppeteer-helper.js`

### Utilisation de variables d'environnement dans le script Puppeteer custom

> [!warning]
> L'utilisation de variables d'environnement est recommandée pour éviter de stocker des informations sensibles dans votre script.

Vous pouvez renseigner les valeurs d'environnement dans un fichier `.env` à la racine de votre projet, puis les utiliser dans votre script Puppeteer custom. Par exemple, avec le package `dotenv`, vous pouvez charger les variables d'environnement et les utiliser dans votre script.  
**Ceci n'est qu'un exemple, vous pouvez utiliser n'importe quelle méthode pour gérer vos variables d'environnement**.

Modèle de fichier de values d'environnement pour le fichier de script Puppeteer custom (.env)

`./custom-puppeteer-script-example/.env.example`
