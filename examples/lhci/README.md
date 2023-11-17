# test

1. Création du lien symbolique si il a sauté

`ln -s ../lighthouse-plugin-ecoindex ./lighthouse-plugin-ecoindex`

2. launch test

- `lhci collect --url https://www.ecoindex.fr/`
- `lhci upload`
- `npm run lhci:collect`
- `npm run lhci:upload`
- `npm run lhci` = collect + upload
