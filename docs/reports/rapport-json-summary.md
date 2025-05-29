---
label: Format JSON Simplifé
icon: file-code
order: 900
---

!!!info
Rapport JSON **Summary/Simplifié** contenant les données essentielles de Lighthouse avec l'intégration des mesures et bonnes pratiques Écoindex.

Utile, par exemple, pour faire des rapports d'audit automatisé à une date précise, sans charger les rapports Lighthouse + Ecoindex complet.
!!!

!!!warning
Ce fichier n'est généré que lors de la mesure d'un parcours avec la commande
`npx lighthouse-plugin-ecoindex collect <options> --json-file <filename.json>`

[!ref Collect d'un parcours](../guides/1-lighthouse-ecoindex-cli.md/#command-collect)
!!!

Exemple de fichier généré lors d'une mesure de parcours.
:::code source="../static/summary.report.json" :::
