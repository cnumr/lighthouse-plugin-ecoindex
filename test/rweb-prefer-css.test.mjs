import assert from 'node:assert/strict'
import test from 'node:test'

import BPRwebPreferCss from '../libs/ecoindex-lh-plugin-ts/dist/audits/bp/rweb-prefer-css.js'

test('RWEB_0037 does not match images outside inline SVG controls', () => {
  const controls = [
    ['button', '<button type="button">Text</button>'],
    ['a', '<a href="/next">Text</a>'],
  ]

  for (const [tag, followingControl] of controls) {
    const html = `<${tag}><svg role="img"><title>Search</title></svg></${tag}><img src="content.jpg" alt="Content">${followingControl}`
    const result = BPRwebPreferCss.audit({ MainDocumentContent: html })

    assert.equal(result.score, 1)
    assert.equal(result.numericValue, 0)
  }
})

test('RWEB_0037 keeps matching images after closing-tag-like content', () => {
  const controls = [
    '<button><!-- example: </button> --><img src="icon.png" alt=""></button>',
    '<button><button-icon></button-icon><img src="icon.png" alt=""></button>',
    '<a href="/"><!-- example: </a> --><img src="icon.png" alt=""></a>',
    '<a href="/"><a-icon></a-icon><img src="icon.png" alt=""></a>',
  ]

  for (const html of controls) {
    const result = BPRwebPreferCss.audit({ MainDocumentContent: html })

    assert.equal(result.score, 0)
    assert.equal(result.numericValue, 1)
  }
})
