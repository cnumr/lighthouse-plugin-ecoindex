---
label: Format JSON Complet
icon: file-code
order: 500
---

!!!info
Rapport JSON Lighthouse **complet** avec l'intégration des mesures et bonnes pratiques Écoindex.
!!!

Les rapports JSON complets servent de sources aux rapports agrégés du répertoire `summary/` lors d'une mesure de parcours (`cliFlags.url === undefined`), y compris avec le mode de sortie `statement`. Aucun rapport agrégé n'est généré lors d'une mesure d'URL directe ni avec une sortie HTML seule.

!!!warning
Ce type de fichier est au format brut Lighthouse et est difficilement exploitable, de préférence, utilisez la version simplifiée.
[!ref Rapport au format JSON Simplifé](rapport-json-summary.md)
!!!

Exemple de fichier généré lors d'une mesure.
:::code source="../static/discovery.report.json" :::
