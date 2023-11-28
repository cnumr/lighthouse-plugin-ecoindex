import { writeFileSync } from 'fs'
import Twig from 'twig'

const data = {
  date: '2023-11-28T18:10:49.874Z',
  best_pages: {
    'course-name': "Découvrir ecoindex et l'écoconception",
    'course-target':
      'Venir sur le site, le découvrir et rejoindre la communauté.',
    'course-description':
      'Attérir sur la "Page d\'accueil", page "Comment ça marche", page "Écoconception"',
    summary: {
      'eco-index-grade': 'A',
      'eco-index-score': 86,
      'eco-index-water': '19.23',
      'eco-index-water-equivalent': 2,
      'eco-index-ghg': '1.28',
      'eco-index-ghg-equivalent': 6,
    },
    pages: [
      {
        requestedUrl: 'https://www.ecoindex.fr/',
        'eco-index-grade': 'A',
        'eco-index-score': 88,
        'eco-index-ghg': '1.23',
        'eco-index-ghg-equivalent': 6,
        'eco-index-water': '18.50',
        'eco-index-water-equivalent': 2,
        'eco-index-nodes': 190,
        'eco-index-size': 31268,
        'eco-index-requests': 5,
      },
      {
        requestedUrl: 'https://www.ecoindex.fr/comment-ca-marche/',
        'eco-index-grade': 'A',
        'eco-index-score': 85,
        'eco-index-ghg': '1.31',
        'eco-index-ghg-equivalent': 6,
        'eco-index-water': '19.60',
        'eco-index-water-equivalent': 2,
        'eco-index-nodes': 290,
        'eco-index-size': 41243,
        'eco-index-requests': 6,
      },
      {
        requestedUrl: 'https://www.ecoindex.fr/ecoconception/',
        'eco-index-grade': 'A',
        'eco-index-score': 85,
        'eco-index-ghg': '1.31',
        'eco-index-ghg-equivalent': 6,
        'eco-index-water': '19.60',
        'eco-index-water-equivalent': 2,
        'eco-index-nodes': 295,
        'eco-index-size': 34593,
        'eco-index-requests': 5,
      },
    ],
  },
  courses: [
    {
      'course-name': 'Rejoindre la communauté',
      'course-target':
        'Venir sur le site, le découvrir et rejoindre la communauté.',
      'course-description':
        'Attérir sur la "Page d\'accueil", page "A propos", page "Nous rejoindre"',
      summary: {
        'eco-index-grade': 'A',
        'eco-index-score': 89,
        'eco-index-water': '18.33',
        'eco-index-water-equivalent': 2,
        'eco-index-ghg': '1.22',
        'eco-index-ghg-equivalent': 6,
      },
      pages: [
        {
          requestedUrl: 'https://www.ecoindex.fr/',
          'eco-index-grade': 'A',
          'eco-index-score': 88,
          'eco-index-ghg': '1.23',
          'eco-index-ghg-equivalent': 6,
          'eco-index-water': '18.50',
          'eco-index-water-equivalent': 2,
          'eco-index-nodes': 190,
          'eco-index-size': 31277,
          'eco-index-requests': 5,
        },
        {
          requestedUrl: 'https://www.ecoindex.fr/a-propos/',
          'eco-index-grade': 'A',
          'eco-index-score': 88,
          'eco-index-ghg': '1.25',
          'eco-index-ghg-equivalent': 6,
          'eco-index-water': '18.70',
          'eco-index-water-equivalent': 2,
          'eco-index-nodes': 209,
          'eco-index-size': 32019,
          'eco-index-requests': 5,
        },
        {
          requestedUrl: 'https://www.ecoindex.fr/nous-rejoindre/',
          'eco-index-grade': 'A',
          'eco-index-score': 91,
          'eco-index-ghg': '1.19',
          'eco-index-ghg-equivalent': 6,
          'eco-index-water': '17.80',
          'eco-index-water-equivalent': 2,
          'eco-index-nodes': 120,
          'eco-index-size': 30409,
          'eco-index-requests': 5,
        },
      ],
    },
    {
      'course-name': "Revoir d'anciens résultats",
      'course-target':
        'Venir consulter une ancienne mesure et en relancer une nouvelle.',
      'course-description':
        "Attérir sur l'ancienne mesure (en venant depuis l'extension chrome par exemple), aller sur la page d'accueil, lancer une nouvelle mesure",
      summary: {
        'eco-index-grade': 'A',
        'eco-index-score': 83,
        'eco-index-water': '20.00',
        'eco-index-water-equivalent': 2,
        'eco-index-ghg': '1.33',
        'eco-index-ghg-equivalent': 6,
      },
      pages: [
        {
          requestedUrl:
            'https://www.ecoindex.fr/resultat/?id=23dfca6a-5fd6-4cf0-b899-6a2d3a597d09',
          'eco-index-grade': 'B',
          'eco-index-score': 78,
          'eco-index-ghg': '1.43',
          'eco-index-ghg-equivalent': 7,
          'eco-index-water': '21.50',
          'eco-index-water-equivalent': 2,
          'eco-index-nodes': 420,
          'eco-index-size': 69776,
          'eco-index-requests': 11,
        },
        {
          requestedUrl: 'https://www.ecoindex.fr/',
          'eco-index-grade': 'A',
          'eco-index-score': 88,
          'eco-index-ghg': '1.23',
          'eco-index-ghg-equivalent': 6,
          'eco-index-water': '18.50',
          'eco-index-water-equivalent': 2,
          'eco-index-nodes': 190,
          'eco-index-size': 31245,
          'eco-index-requests': 5,
        },
      ],
    },
  ],
}

Twig.renderFile('./markdown.twig', data, (err, md) => {
  md // compiled string
  console.log(md)
  writeFileSync('./export.md', md)
})
