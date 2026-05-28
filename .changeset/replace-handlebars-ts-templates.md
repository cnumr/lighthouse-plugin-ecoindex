---
'lighthouse-plugin-ecoindex-courses': patch
---

Remplace la dépendance `handlebars` (abandonnée, 8 CVE ouvertes) par des fonctions TypeScript natives pour le rendu des déclarations environnementales. Aucun changement de comportement visible : les fichiers `.md` et `.html` générés restent équivalents.
