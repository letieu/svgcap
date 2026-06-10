import * as xmldom from '@xmldom/xmldom'
import defaultModel from './MODEL.json' with { type: 'json' }

export function solve(svgString, model = defaultModel) {
  const doc = new xmldom.DOMParser().parseFromString(svgString, 'image/svg+xml')
  const paths = Array.from(doc.getElementsByTagName('path'))
  const chars = []

  for (const path of paths) {
    const isStroke = path.getAttribute('stroke')
    if (isStroke) continue

    const d = path.getAttribute('d')
    if (!d) continue

    // M164.04 14.35L164.13 14.4 ...
    const x = +d.split('.').at(0).replace('M', '')
    const pattern = d.replace(/[\d.\s]/g, ''); // remove whitespace, digits, dot.

    const char = model[pattern] || '.'
    chars.push({ char, x })
  }

  chars.sort((a, b) => a.x - b.x)
  return chars.map(c => c.char).join('')
}
