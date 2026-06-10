import fs from 'fs/promises'
import path from 'node:path'
import * as xmldom from '@xmldom/xmldom'

export async function train(inputFolder) {
  let model = {}

  const files = await fs.readdir(inputFolder)
  for (const file of files) {
    const svg = await fs.readFile(
      path.join(inputFolder, file),
      'utf8'
    );

    const answer = path.basename(file, '.svg')

    const partModel = trainSvg(svg, answer)
    if (partModel) {
      model = { ...model, ...partModel }
    }
  }

  return model
}

export function trainSvg(svgString, answer) {
  const model = {}
  const doc = new xmldom.DOMParser().parseFromString(svgString, 'image/svg+xml')
  const paths = Array.from(
    doc.getElementsByTagName('path')
  )

  const chars = []
  for (const p of paths) {
    const stroke = p.getAttribute('stroke') || '';

    if (stroke.length > 0)
      continue;

    const d = p.getAttribute('d');

    const x = parseInt(
      d.split('.')[0].replace('M', ''),
      10
    );

    const pattern = d.replace(
      /[\d.\s]/g,
      ''
    );

    chars.push({
      x,
      pattern,
    });
  }

  chars.sort((a, b) => a.x - b.x)

  if (chars.length != answer.length) {
    console.warn("skip, chars len diff answer len")
    console.log(chars, answer)
    return
  }

  for (let i = 0; i < chars.length; i++) {
    const pattern = chars[i].pattern
    const char = answer[i]

    const modelChar = model[pattern]
    if (modelChar && modelChar != char) {
      console.warn(`conflict in file ${answer}, char: ${char}, but old is: ${modelChar} .`)
    }

    model[pattern] = char
  }

  return model
}
