---
label: Rapport des bonnes pratiques
icon: checklist
order: 850
---

!!!info
Les rapports agrégés des bonnes pratiques sont générés dans `summary/best-practices.report.json` et `summary/best-practices.report.md` lors d'une mesure de parcours (`cliFlags.url === undefined`) lorsqu'au moins un rapport source JSON existe, y compris avec le mode de sortie `statement`.
!!!

Ils ne sont pas générés lors d'une mesure d'URL directe ni avec une sortie HTML seule. Le répertoire réservé `summary/` évite les collisions avec les noms des rapports de parcours.

Les deux formats regroupent les résultats par parcours, puis par page. Chaque page sépare les bonnes pratiques RWEB, dont les identifiants commencent par `rweb-`, et les bonnes pratiques génériques, dont les identifiants commencent par `bp-`.

Le statut ne retient que les scores exacts `1` et `0` : `1` devient `OK` et `0` devient `KO`. Les autres scores ne sont pas inclus.

Le rapport JSON exclut les champs `details`, `scoreDisplayMode`, `numericValue` et `numericUnit`.

Le rapport Markdown affiche `displayValue` sous le titre de chaque audit. Lorsque des détails Lighthouse sont disponibles, ils sont affichés dans un bloc natif fermé `<details>` uniquement pour les audits `KO`.
