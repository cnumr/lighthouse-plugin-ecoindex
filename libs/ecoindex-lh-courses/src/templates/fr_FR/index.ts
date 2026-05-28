import type { StatementsReport } from '../../types/index.js'
import { B_TO_KB } from '../../utils/index.js'

type PageEntry = {
  requestedUrl: string
  'eco-index-grade': string
  'eco-index-score': number | string
  'eco-index-water': number | string
  'eco-index-water-equivalent': number | string
  'eco-index-ghg': number | string
  'eco-index-ghg-equivalent': number | string
  'eco-index-nodes': number | string
  'eco-index-size': number | string
  'eco-index-requests': number | string
}

type BestPages = {
  summary: {
    'eco-index-grade': string
    'eco-index-score': number | string
    'eco-index-water': number | string
    'eco-index-water-equivalent': number | string
    'eco-index-ghg': number | string
    'eco-index-ghg-equivalent': number | string
  }
  pages: PageEntry[]
}

type CourseEntry = {
  'course-name': string
  'course-target': string
  'course-description': string
  summary: {
    'eco-index-grade': string
    'eco-index-water': number | string
    'eco-index-water-equivalent': number | string
    'eco-index-ghg': number | string
    'eco-index-ghg-equivalent': number | string
  }
  pages: PageEntry[]
}

const ASSET_BASE =
  'https://raw.githubusercontent.com/cnumr/lighthouse-plugin-ecoindex/main/assets'

function convertPageSize(size: number | string): string {
  return (Number(size) / B_TO_KB).toFixed(3)
}

export function renderMarkdown(data: StatementsReport): string {
  const bp = data.best_pages as BestPages
  const grade = String(bp.summary['eco-index-grade'])
  const dateStr = new Date(data.date).toDateString()

  const bestPages = bp.pages
    .map(
      (page, i) => `
### Page ${i + 1} : ${page.requestedUrl}

|Grade|Ecoindex|Eau (cl)|GES (gCO2e)|Nb de requêtes|Taille de la page (Ko)|Taille du DOM|
|---|---|---|---|---|---|---|
|${page['eco-index-grade']}|${page['eco-index-score']}/100|${page['eco-index-water']}|${page['eco-index-ghg']}|${page['eco-index-requests']}|${convertPageSize(page['eco-index-size'])}|${page['eco-index-nodes']}|


* Consommation d'eau rapportée à 1 000 utilisateurs (en litres) : ${page['eco-index-water']} (soit ${page['eco-index-water-equivalent']} packs d'eau minérale).
* Émission de GES rapportée à 1 000 utilisateurs (kilos CO2e) : ${page['eco-index-ghg']} (soit un trajet de ${page['eco-index-ghg-equivalent']} kms en voiture à énergie thermique).
`,
    )
    .join('')

  const courses = (data.courses as CourseEntry[])
    .map((course, i) => {
      const pages = course.pages
        .map(
          p =>
            `|${p.requestedUrl}|${p['eco-index-grade']}|${p['eco-index-score']}/100|${p['eco-index-water']}|${p['eco-index-ghg']}|${p['eco-index-requests']}|${convertPageSize(p['eco-index-size'])}|${p['eco-index-nodes']}|`,
        )
        .join('\n')
      return `
### Parcours ${i + 1} : ${course['course-name']}
* **Objectif du parcours** : ${course['course-target']}
* **Parcours cible** : ${course['course-description']}

|Page|Grade|Ecoindex|Eau (cl)|GES (gCO2e)|Nb de requêtes|Taille de la course (Ko)|Taille du DOM|
|---|---|---|---|---|---|---|---|
${pages}

* Consommation d'eau rapportée à 1 000 utilisateurs (en litres) : ${course.summary['eco-index-water']} (soit ${course.summary['eco-index-water-equivalent']} packs d'eau minérale).
* Émission de GES rapportée à 1 000 utilisateurs (kilos CO2e) : ${course.summary['eco-index-ghg']} (soit un trajet de ${course.summary['eco-index-ghg-equivalent']} kms en voiture à énergie thermique).
`
    })
    .join('')

  return `# Déclaration environnementale de ce site web

Mesure effectuée le ${dateStr}.

## Niveau d'écoconception du site web
![Note ${grade}](${ASSET_BASE}/Note-${grade}.webp)
* Note Ecoindex : **${bp.summary['eco-index-score']}/100**
* Consommation d'eau moyenne rapportée à 1 000 utilisateurs (en litres) : **${bp.summary['eco-index-water']} litres, (soit ${bp.summary['eco-index-water-equivalent']} packs d'eau minérale).***
* Émission de Gaz à Effet de Serre (GES) moyenne rapportée à 1 000 utilisateurs (kilos CO2e) : **${bp.summary['eco-index-ghg']} kilos CO2e (soit un trajet de ${bp.summary['eco-index-ghg-equivalent']} kms en voiture à énergie thermique).***
## Méthode d'évaluation
Comme toute production numérique, ce site web a un impact environnemental que nous vous présentons sur cette page à l'aide d'indicateurs standardisés.

Nous utilisons le référentiel [EcoIndex](https://www.ecoindex.fr/) proposé par le [collectif GreenIT.fr](https://www.greenit.fr/), pour évaluer la performance environnementale de ce site web. Celui-ci est quantifié grâce à deux types d'indicateurs :
1. **Niveau d'écoconception du site web**. Cet indicateur évalue la mise en place de bonnes pratiques permettant de réduire l'impact d'une page web. Le niveau atteint est représenté par une évaluation relative de A à G (A est la meilleure note) associée à un score absolu de 0 à 100 (100 est la meilleure note).
2. **Consommation d'eau et émission de GES liées au chargement de la page**. Cet indicateur quantifie la consommation d'eau douce (cls) et l'émission de GES (gCO2e) liées au chargement d'une page web.

À des fins de synthèse, quatre types de données sont représentées :
1. Niveau d'écoconception pour les 5 pages les plus visitées du site web
2. Niveau d'écoconception pour 5 parcours utilisateurs type du site web
3. Consommation d'eau (exprimée en litres) et émission de GES (kilos CO2e) liée au chargement d'une page web pour 1 utilisateur, et rapportée à 1 000 utilisateurs.
4. Consommation d'eau (exprimée en litres) et émission de GES (kilos CO2e) liée à l'exécution d'un parcours pour 1 utilisateur, et rapportée à 1 000 utilisateurs.

L'analyse indiquée a été effectuée le ${dateStr}, elle est susceptible d'évoluer : la quantification des impacts environnementaux présentée ci-dessous est une photographie réalisée à un instant T.

## Evaluation de l'impact des 5 pages les plus visitées du site
${bestPages}
## Evaluation de l'impact pour 5 parcours utilisateurs sur le site
${courses}
## L'écoconception

L'écoconception s'appuie sur une méthodologie et un ensemble de bonnes pratiques pour réduire l'impact de ce site web sur son environnement. Concrètement, il va s'agir de limiter les ressources techniques nécessaires à l'affichage d'une page ou à l'exécution d'une fonctionnalité, tout en étant au plus proche du besoin de l'utilisateur.

Vous êtes un professionnel du numérique et vous souhaitez réduire l'impact environnemental de vos sites ? Voici quelques bonnes pratiques à mettre en oeuvre :

### Quelques bonnes pratiques en matière d'ergonomie et de design
* Limiter le nombre de fonctionnalités dès la conception
* Supprimer les fonctionnalités non utilisées
* Limiter le nombre de carrousels
* Choisir des typographies au poids réduit
* Favoriser les designs simples et épurés
* Adopter quand cela est possible une approche "mobile-first"
* Préférer la pagination au défilement infini
* Éviter la lecture et le chargement automatique des vidéos et des sons
* Optimiser les parcours utilisateurs
* ...

### Quelques bonnes pratiques en matière de gestion des contenus
* Préférer les images aux vidéos
* Limiter le nombre d'images sur chaque page
* Optimiser la taille des images au format cible
* Compresser les images via un outil de type [TinyPNG](https://tinypng.com/)
* Compresser les pdfs via un outil de type [iLovePDF](https://www.ilovepdf.com/fr/compresser_pdf)
* Limiter l'utilisation des GIFs animés
* Préférer les glyphs aux images
* ...

### Quelques bonnes pratiques en matière de développement
* Proposer un traitement asynchrone lorsque c'est possible
* N'utilisez que les portions indispensables des bibliothèques JS et CSS
* Mettre en cache les données calculées souvent utilisées
* Limiter le nombre d'appels aux API HTTP
* Réduire le volume de données stockées au strict nécessaire
* Utiliser la version la plus récente du langage
* Fournir une alternative textuelle aux contenus multimédias
* Découper les CSS
* Ne pas faire de modification du DOM lorsqu'on le traverse
* Utiliser le chargement paresseux (lazyload)
* Valider les pages auprès du W3C
* Ajouter des entêtes Expires ou Cache-Control
* Compresser les fichiers texte : CSS, JS, HTML et SVG
* Mettre en place un sitemap efficient
* ...

### Quelques bonnes pratiques en matière d'hébergement
* Choisir un hébergeur écoresponsable
* Installer le minimum requis sur le serveur
* S'appuyer sur les services managés
* Optimiser l'efficacité énergétique des serveurs
* Réduire au nécessaire les logs des serveurs
* Apache Vhost : désactiver le AllowOverride
* Utiliser des serveurs virtualisés
* Utiliser un serveur asynchrone
* Stocker les données dans le cloud
* ...

### Pour mettre en place votre déclaration environnementale :

* [Accéder à la documentation](https://declaration.greenit.fr/)

### Pour consulter la liste complète de bonnes pratiques de l'écoconception web :

* [Accéder au site web GreenIT](https://www.greenit.fr/)
* [Accéder au dépôt GreenIt (GitHub)](https://github.com/cnumr/best-practices)

### Pour en savoir plus sur EcoIndex :

* [En savoir plus sur le référentiel EcoIndex](https://www.ecoindex.fr/comment-ca-marche/)
* [Accéder au site web EcoIndex](https://www.ecoindex.fr/)

_*Moyenne de l'impact environnemental des 5 pages les plus visitées ce site web._`
}

export function renderHtml(data: StatementsReport): string {
  const bp = data.best_pages as BestPages
  const grade = String(bp.summary['eco-index-grade'])
  const dateStr = new Date(data.date).toDateString()
  const grades = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

  const gradeNotes = grades
    .map(
      g =>
        `      <li class="ecoindex__note${grade === g ? ' ecoindex__note--active' : ''}"${g === 'A' ? ' title="A - note active"' : ''}>${g}</li>`,
    )
    .join('\n')

  const bestPages = bp.pages
    .map(
      (page, i) => `    <h3>
      <a href="${page.requestedUrl}" target="_blank" rel="noopener" title="Page ${i + 1} : ${page.requestedUrl} (nouvelle fenêtre)">Page ${i + 1} : ${page.requestedUrl}</a>
    </h3>
    <p>
      <table class="mesure-page">
        <caption>
          Les 5 pages les plus visitées
        </caption>
        <tr>
          <th scope="col">Grade</th>
          <th scope="col">Ecoindex</th>
          <th scope="col">Eau (cl)</th>
          <th scope="col">GES (gCO2e)</th>
          <th scope="col">Nb de requêtes</th>
          <th scope="col">Taille de la page (Ko)</th>
          <th scope="col">Taille du DOM</th>
        </tr>
        <tr>
          <td>${page['eco-index-grade']}</td>
          <td>${page['eco-index-score']}/100</td>
          <td>${page['eco-index-water']}</td>
          <td>${page['eco-index-ghg']}</td>
          <td>${page['eco-index-requests']}</td>
          <td>${convertPageSize(page['eco-index-size'])}</td>
          <td>${page['eco-index-nodes']}</td>
        </tr>
      </table>
    </p>
    <ul>
      <li>Consommation d'eau rapportée à 1 000 utilisateurs : <strong>${page['eco-index-water']} litres</strong>, soit ${page['eco-index-water-equivalent']} packs d'eau minérale. </li>
      <li>Émission de GES rapportée à 1 000 utilisateurs : <strong>${page['eco-index-ghg']} kilos CO2e</strong>, soit un trajet de ${page['eco-index-ghg-equivalent']} kms en voiture à énergie thermique. </li>
    </ul>`,
    )
    .join('\n')

  const courseSections = (data.courses as CourseEntry[])
    .map((course, i) => {
      const rows = course.pages
        .map(
          p => `        <tr>
          <th scope="row">${p.requestedUrl}</th>
          <td>${p['eco-index-grade']}</td>
          <td>${p['eco-index-score']}/100</td>
          <td>${p['eco-index-water']}</td>
          <td>${p['eco-index-ghg']}</td>
          <td>${p['eco-index-requests']}</td>
          <td>${convertPageSize(p['eco-index-size'])}</td>
          <td>${p['eco-index-nodes']}</td>
        </tr>`,
        )
        .join('\n')
      return `    <h3>Parcours ${i + 1} : ${course['course-name']}</h3>
    <ul>
      <li>
        <strong>Objectif du parcours : </strong>${course['course-target']}
      </li>
      <li>
        <strong>Parcours cible</strong> : ${course['course-description']}
      </li>
    </ul>
    <p>
      <table class="mesure-page">
        <caption>
          Parcours ${i + 1}
        </caption>
        <tr>
          <th scope="col">Page</th>
          <th scope="col">Grade</th>
          <th scope="col">Ecoindex</th>
          <th scope="col">Eau (cl)</th>
          <th scope="col">GES (gCO2e)</th>
          <th scope="col">Nb de requêtes</th>
          <th scope="col">Taille de la page (Ko)</th>
          <th scope="col">Taille du DOM</th>
        </tr>
${rows}
      </table>
    </p>
    <ul>
      <li>Consommation d'eau rapportée à 1 000 utilisateurs : <strong>${course.summary['eco-index-water']} litres</strong>, soit ${course.summary['eco-index-water-equivalent']} packs d'eau minérale. </li>
      <li>Émission de GES rapportée à 1 000 utilisateurs : <strong>${course.summary['eco-index-ghg']} kilos CO2e</strong>, soit un trajet de ${course.summary['eco-index-ghg-equivalent']} kms en voiture à énergie thermique. </li>
    </ul>`
    })
    .join('\n')

  return `<!DOCTYPE html>
<html class="no-js" lang="fr-FR">
  <head>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
    <title>Déclaration environnementale</title>
    <style>
      .ecoindex__list {
        display: flex;
        flex-wrap: wrap;
        padding: 0;
        margin: 0;
        list-style: none;
      }

      .ecoindex__note {
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        align-items: flex-end;
        justify-content: flex-end;
        display: flex;
        padding: 0.325rem;
        margin: 0.15rem;
        border-width: 0.125rem;
        border-style: solid;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 0.625rem;
        font-size: 0.725rem;
        color: #000;
        font-weight: bold;
        background-color: #fff;
      }

      @media (min-width: 55em) {
        .ecoindex__note {
          width: 5rem;
          height: 5rem;
          border-radius: 1.25rem;
          font-size: 1.375rem;
          padding: 0.625rem;
          margin: 0.25rem;
        }
      }

      /* A */
      .ecoindex__note:nth-of-type(1) {
        border-color: #4f9f30;
      }

      .ecoindex__note:nth-of-type(1).ecoindex__note--active {
        background-color: #4f9f30;
      }

      /* B */
      .ecoindex__note:nth-of-type(2) {
        border-color: #51b84b;
      }

      .ecoindex__note:nth-of-type(2).ecoindex__note--active {
        background-color: #51b84b;
      }

      /* C */
      .ecoindex__note:nth-of-type(3) {
        border-color: #cadb2a;
      }

      .ecoindex__note:nth-of-type(3).ecoindex__note--active {
        background-color: #cadb2a;
      }

      /* D */
      .ecoindex__note:nth-of-type(4) {
        border-color: #f6eb15;
      }

      .ecoindex__note:nth-of-type(4).ecoindex__note--active {
        background-color: #f6eb15;
      }

      /* E */
      .ecoindex__note:nth-of-type(5) {
        border-color: #fecd06;
      }

      .ecoindex__note:nth-of-type(5).ecoindex__note--active {
        background-color: #fecd06;
      }

      /* F */
      .ecoindex__note:nth-of-type(6) {
        border-color: #f99839;
      }

      .ecoindex__note:nth-of-type(6).ecoindex__note--active {
        background-color: #f99839;
      }

      /* G */
      .ecoindex__note:nth-of-type(7) {
        border-color: #ed2124;
      }

      .ecoindex__note:nth-of-type(7).ecoindex__note--active {
        background-color: #ed2124;
      }

      .mesure-page {
        border-collapse: collapse;
        border: 1px solid #ccc;
        width: 100%;
      }
      .mesure-page th,
      .mesure-page td {
        padding: 0.5rem;
        text-align: left;
        border: 1px solid #ccc;
      }
    </style>
  </head>
  <body>
    <h1>Déclaration environnementale de ce site web</h1>
    <blockquote>
      <p>Mesure effectuée le ${dateStr}.</p>
    </blockquote>
    <h2>Niveau d'écoconception du site web</h2>
    <ul class="ecoindex__list">
${gradeNotes}
    </ul>
    <ul>
      <li>Note Ecoindex : <strong>${bp.summary['eco-index-score']}/100</strong>
      </li>
      <li>Consommation d'eau moyenne rapportée à 1 000 utilisateurs : <strong>${bp.summary['eco-index-water']} litres</strong>, soit ${bp.summary['eco-index-water-equivalent']} packs d'eau minérale. <sup>*</sup>
      </li>
      <li>Émission de Gaz à Effet de Serre (GES) moyenne rapportée à 1 000 utilisateurs : <strong>${bp.summary['eco-index-ghg']} kilos <abbr title="équivalent CO2">CO2e</abbr>
        </strong>, soit un trajet de ${bp.summary['eco-index-ghg-equivalent']} kms en voiture à énergie thermique. <sup>*</sup>
      </li>
    </ul>
    <h2>Méthode d'évaluation</h2>
    <p>Comme toute production numérique, ce site web a un impact environnemental que nous vous présentons sur cette page à l'aide d'indicateurs standardisés.</p>
    <p>Nous utilisons le référentiel <a href="https://www.ecoindex.fr/comment-ca-marche/" target="_blank" rel="noopener" title="EcoIndex (nouvelle fenêtre)">EcoIndex</a> proposé par le collectif <a href="https://www.greenit.fr/" target="_blank" rel="noopener" title="GreenIT.fr (nouvelle fenêtre)">GreenIT.fr</a>, pour évaluer la performance environnementale de ce site web. Celui-ci est quantifié grâce à deux types d'indicateurs : </p>
    <ul>
      <li>
        <strong>Niveau d'écoconception du site web.</strong>Cet indicateur évalue la mise en place de bonnes pratiques permettant de réduire l'impact d'une page web. Le niveau atteint est représenté par une évaluation relative de A à G (A est la meilleure note) associée à un score absolu de 0 à 100 (100 est la meilleure note).
      </li>
      <li>
        <strong>Consommation d'eau et émission de GES liées au chargement de la page. </strong>Cet indicateur quantifie la consommation d'eau douce ( <abbr title="centilitres">cls</abbr>) et l'émission de GES ( <abbr title="grammes équivalents CO2">gCO2e</abbr>) liées au chargement d'une page web.
      </li>
    </ul>
    <p>À des fins de synthèse, quatre types de données sont représentées :</p>
    <ul>
      <li>Niveau d'écoconception pour les 5 pages les plus visitées du site web</li>
      <li>Niveau d'écoconception pour 5 parcours utilisateurs type du site web</li>
      <li>Consommation d'eau (exprimée en litres) et émission de GES (kilos CO2e) liée au chargement d'une page web pour 1 utilisateur, et rapportée à 1 000 utilisateurs.</li>
      <li>Consommation d'eau (exprimée en litres) et émission de GES (kilos CO2e) liée à l'exécution d'un parcours pour 1 utilisateur, et rapportée à 1 000 utilisateurs.</li>
    </ul>
    <p>L'analyse indiquée a été effectuée le ${dateStr}, elle est susceptible d'évoluer : la quantification des impacts environnementaux présentée ci-dessous est une photographie réalisée à un instant T.</p>
    <h2>Évaluation de l'impact des 5 pages les plus visitées du site</h2>
${bestPages}
    <h2>Évaluation de l'impact pour 5 parcours utilisateurs sur le site</h2>
${courseSections}
    <h2>L'écoconception</h2>
    <p>L'écoconception s'appuie sur une méthodologie et un ensemble de bonnes pratiques pour réduire l'impact de ce site web sur son environnement. Concrètement, il va s'agir de limiter les ressources techniques nécessaires à l'affichage d'une page ou à l'exécution d'une fonctionnalité, tout en étant au plus proche du besoin de l'utilisateur.</p>
    <p>Vous êtes un professionnel du numérique et vous souhaitez réduire l'impact environnemental de vos sites ? Voici quelques bonnes pratiques à mettre en oeuvre :</p>
    <h3>Quelques bonnes pratiques en matière d'ergonomie et de design</h3>
    <ul>
      <li>Limiter le nombre de fonctionnalités dès la conception</li>
      <li>Supprimer les fonctionnalités non utilisées</li>
      <li>Limiter le nombre de carrousels</li>
      <li>Choisir des typographies au poids réduit</li>
      <li>Favoriser les designs simples et épurés</li>
      <li>Adopter quand cela est possible une approche "mobile-first"</li>
      <li>Préférer la pagination au défilement infini</li>
      <li>Éviter la lecture et le chargement automatique des vidéos et des sons</li>
      <li>Optimiser les parcours utilisateurs</li>
      <li>...</li>
    </ul>
    <h3>Quelques bonnes pratiques en matière de gestion des contenus</h3>
    <ul>
      <li>Préférer les images aux vidéos</li>
      <li>Limiter le nombre d'images sur chaque page</li>
      <li>Optimiser la taille des images au format cible</li>
      <li>Compresser les images via un outil de type <a href="https://tinypng.com/" target="_blank" rel="noopener" title="TinyPNG (nouvelle fenêtre)">TinyPNG</a>
      </li>
      <li>Compresser les pdfs via un outil de type <a href="https://www.ilovepdf.com/fr/compresser_pdf" target="_blank" rel="noopener" title="iLovePDF (nouvelle fenêtre)">iLovePDF</a>
      </li>
      <li>Limiter l'utilisation des GIFs animés</li>
      <li>Préférer les glyphs aux images</li>
      <li>...</li>
    </ul>
    <h3>Quelques bonnes pratiques en matière de développement</h3>
    <ul>
      <li>Proposer un traitement asynchrone lorsque c'est possible</li>
      <li>N'utilisez que les portions indispensables des bibliothèques JS et CSS</li>
      <li>Mettre en cache les données calculées souvent utilisées</li>
      <li>Limiter le nombre d'appels aux API HTTP</li>
      <li>Réduire le volume de données stockées au strict nécessaire</li>
      <li>Utiliser la version la plus récente du langage</li>
      <li>Fournir une alternative textuelle aux contenus multimédias</li>
      <li>Découper les CSS</li>
      <li>Ne pas faire de modification du <abbr title="Modèle Objet de Document">DOM</abbr> lorsqu'on le traverse </li>
      <li>Utiliser le chargement paresseux ( <span lang="en">lazyload</span>) </li>
      <li>Valider les pages auprès du <abbr title="World Wide Web Consortium">W3C</abbr>
      </li>
      <li>Ajouter des entêtes Expires ou Cache-Control</li>
      <li>Compresser les fichiers texte : CSS, JS, HTML et SVG</li>
      <li>Mettre en place un sitemap efficient</li>
      <li>...</li>
    </ul>
    <h3>Quelques bonnes pratiques en matière d'hébergement</h3>
    <ul>
      <li>Choisir un hébergeur écoresponsable</li>
      <li>Installer le minimum requis sur le serveur</li>
      <li>S'appuyer sur les services managés</li>
      <li>Optimiser l'efficacité énergétique des serveurs</li>
      <li>Réduire au nécessaire les logs des serveurs</li>
      <li>Apache Vhost : désactiver le <span lang="en">AllowOverride</span>
      </li>
      <li>Utiliser des serveurs virtualisés</li>
      <li>Utiliser un serveur asynchrone</li>
      <li>Stocker les données dans le cloud</li>
      <li>...</li>
    </ul>
    <h3>
      <strong>Pour mettre en place votre déclaration environnementale :</strong>
    </h3>
    <p>
      <a href="https://docs.greenit.fr/declaration-environnementale" target="_blank" rel="noopener" title="Accéder à la documentation (nouvelle fenêtre)">Accéder à la documentation</a>
    </p>
    <h3>
      <strong>Pour consulter la liste complète de bonnes pratiques de l'écoconception web :</strong>
    </h3>
    <p>
      <a href="https://collectif.greenit.fr/ecoconception-web/115-bonnes-pratiques-eco-conception_web.html" target="_blank" rel="noopener" title="Accéder au site web GreenIt (nouvelle fenêtre)">Accéder au site web GreenIt</a>
    </p>
    <p>
      <a href="https://github.com/cnumr/best-practices" target="_blank" rel="noopener" title="Accéder au dépôt GreenIt (GitHub) (nouvelle fenêtre)">Accéder au dépôt GreenIt (GitHub)</a>
    </p>
    <h3>
      <strong>Pour en savoir plus sur EcoIndex :</strong>
    </h3>
    <p>
      <a href="https://www.ecoindex.fr/comment-ca-marche/" target="_blank" rel="noopener" title="En savoir plus sur le référentiel EcoIndex (nouvelle fenêtre)">En savoir plus sur le référentiel EcoIndex</a>
    </p>
    <p>
      <a href="http://www.ecoindex.fr/" target="_blank" rel="noopener" title="Accéder au site web EcoIndex (nouvelle fenêtre)">Accéder au site web EcoIndex</a>
    </p>
    <p>
      <i>*Moyenne de l'impact environnemental des 5 pages les plus visitées sur ce site web.</i>
    </p>
  </body>
</html>`
}
