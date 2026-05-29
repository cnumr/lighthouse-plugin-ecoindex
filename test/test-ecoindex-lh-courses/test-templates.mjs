import { test } from 'node:test'
import assert from 'node:assert/strict'
import {
  renderMarkdown,
  renderHtml,
} from 'lighthouse-plugin-ecoindex-courses/templates'

const fixture = {
  version_api: '1.0.0',
  date: '2024-01-15T10:00:00.000Z',
  best_pages: {
    'course-name': 'Test',
    'course-target': 'Test target',
    'course-description': 'Test description',
    summary: {
      'eco-index-grade': 'A',
      'eco-index-score': 97,
      'eco-index-water': '15.80',
      'eco-index-water-equivalent': 2,
      'eco-index-ghg': '1.05',
      'eco-index-ghg-equivalent': 5,
    },
    pages: [
      {
        requestedUrl: 'http://example.com/page',
        'eco-index-grade': 'A',
        'eco-index-score': 97,
        'eco-index-water': '15.80',
        'eco-index-water-equivalent': 2,
        'eco-index-ghg': '1.05',
        'eco-index-ghg-equivalent': 5,
        'eco-index-nodes': 17,
        'eco-index-size': 1500,
        'eco-index-requests': 1,
      },
    ],
  },
  courses: [
    {
      'course-name': 'Test Course',
      'course-target': 'Target description',
      'course-description': 'Course description',
      summary: {
        'eco-index-grade': 'B',
        'eco-index-water': '18.00',
        'eco-index-water-equivalent': 2,
        'eco-index-ghg': '1.20',
        'eco-index-ghg-equivalent': 6,
      },
      pages: [
        {
          requestedUrl: 'http://example.com/course-page',
          'eco-index-grade': 'B',
          'eco-index-score': 85,
          'eco-index-water': '18.00',
          'eco-index-water-equivalent': 2,
          'eco-index-ghg': '1.20',
          'eco-index-ghg-equivalent': 6,
          'eco-index-nodes': 50,
          'eco-index-size': 2000,
          'eco-index-requests': 3,
        },
      ],
    },
  ],
}

test('renderMarkdown includes formatted date', () => {
  const result = renderMarkdown(fixture)
  assert.ok(
    result.includes('Mon Jan 15 2024'),
    `Expected "Mon Jan 15 2024" in output`,
  )
})

test('renderMarkdown includes grade image for active grade', () => {
  const result = renderMarkdown(fixture)
  assert.ok(result.includes('![Note A]('), `Expected grade A image`)
  assert.ok(!result.includes('![Note B]('), `Expected no grade B image`)
})

test('renderMarkdown numbers best pages starting at 1', () => {
  const result = renderMarkdown(fixture)
  assert.ok(
    result.includes('Page 1 : http://example.com/page'),
    `Expected "Page 1 :" in output`,
  )
})

test('renderMarkdown converts page size from bytes to KB', () => {
  const result = renderMarkdown(fixture)
  // 1500 / 1000 = 1.500
  assert.ok(
    result.includes('1.500'),
    `Expected "1.500" (1500 bytes = 1.500 KB)`,
  )
})

test('renderMarkdown numbers courses starting at 1', () => {
  const result = renderMarkdown(fixture)
  assert.ok(
    result.includes('Parcours 1 : Test Course'),
    `Expected "Parcours 1 :" in output`,
  )
})

test('renderHtml includes active grade css class', () => {
  const result = renderHtml(fixture)
  assert.ok(
    result.includes('ecoindex__note--active'),
    `Expected active grade class`,
  )
})

test('renderHtml score is present', () => {
  const result = renderHtml(fixture)
  assert.ok(result.includes('97/100'), `Expected score 97/100`)
})

test('renderHtml includes course page url', () => {
  const result = renderHtml(fixture)
  assert.ok(
    result.includes('http://example.com/course-page'),
    `Expected course page URL`,
  )
})

test('renderHtml converts page size from bytes to KB', () => {
  const result = renderHtml(fixture)
  // 2000 / 1000 = 2.000
  assert.ok(
    result.includes('2.000'),
    `Expected "2.000" (2000 bytes = 2.000 KB)`,
  )
})
