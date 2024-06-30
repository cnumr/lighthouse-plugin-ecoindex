type IConstants = {
  channels: { [key: string]: string }
  labels: { [key: string]: { [key: string]: string } }
  utils: { JSON_FILE_NAME: string; DEFAULT_JSON_DATA: IJsonMesureData }
}
const constants: IConstants = {
  channels: {
    ASYNCHRONOUS_LOG: 'asynchronous-log',
    SIMPLE_MESURES: 'simple-mesures',
    JSON_MESURES: 'json-mesures',
    SAVE_JSON_FILE: 'save-json-file',
    READ_RELOAD_JSON_FILE: 'read-reload-json-file',
    // JSON_FILE_FOUNDED: 'readed-json-file',
    GET_WORKDIR: 'get-workdir',
    GET_NODE_VERSION: 'get-node-version',
    SELECT_FOLDER: 'dialog:select-folder',
    IS_LIGHTHOUSE_ECOINDEX_INSTALLED: 'is-lighthouse-ecoindex-installed',
    IS_NODE_INSTALLED: 'is-node-installed',
    IS_JSON_CONFIG_FILE_EXIST: 'is-json-config-file-exist',
    HOST_INFORMATIONS: 'host-informations',
  },
  labels: {
    en: {
      'full-mesures-label': 'Courses Mesure (Full mode)',
      'simple-mesures-label': 'Url(s) Mesure (Simple mode)',
    },
  },
  utils: {
    JSON_FILE_NAME: 'input-file.json',
    DEFAULT_JSON_DATA: {
      'extra-header': {
        Cookie: 'monster=blue',
        'x-men': 'wolverine',
        Authorization: 'Basic c3BpZTpFaXBzRXJnb1N1bTQyJA==',
        'config-source': 'input-file.json',
      },
      output: ['json', 'statement'],
      'output-path': './reports',
      'user-agent': 'insights',
      'output-name': 'ecoindex',
      courses: [
        {
          name: 'BEST PAGES',
          target: 'TBD.',
          course: 'Not applicable on bests pages',
          'is-best-pages': true,
          urls: [
            'https://www.ecoindex.fr/',
            'https://www.ecoindex.fr/comment-ca-marche/',
            'https://www.ecoindex.fr/ecoconception/',
            'https://www.ecoindex.fr/a-propos/',
            'https://www.ecoindex.fr/nous-rejoindre/',
          ],
        },
        {
          name: 'DISCOVERY',
          target: 'Visit the website and join the association.',
          course:
            'Consult the site pages, understand the ecoindex, discover eco-design and join the association',
          'is-best-pages': false,
          urls: [
            'https://www.ecoindex.fr/',
            'https://www.ecoindex.fr/comment-ca-marche/',
            'https://www.ecoindex.fr/ecoconception/',
            'https://www.ecoindex.fr/a-propos/',
            'https://www.ecoindex.fr/nous-rejoindre/',
          ],
        },
      ],
    },
  },
}
export const channels = constants.channels
export const utils = constants.utils
export const labels = constants.labels
