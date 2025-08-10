---
'lighthouse-plugin-ecoindex-core': patch
'lighthouse-plugin-ecoindex-courses': patch
'lighthouse-plugin-ecoindex': patch
---

- fix: amélioration de la gestion des erreurs lors de l'importation du script Puppeteer, ajout d'un message d'erreur si le fichier n'est pas trouvé.
- feat: mise à jour de l'importation dynamique du script Puppeteer pour inclure des options supplémentaires (position et urls) dans l'appel de la fonction
- docs: ajout d'une section sur l'utilisation de fichiers de script Puppeteer personnalisés pour les audits avec authentification complexe, incluant des avertissements et des exemples de configuration.
