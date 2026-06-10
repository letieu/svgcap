import fs from 'fs/promises'
import path from 'node:path'
import { solve } from './solve.js'

const captchasFolder = './captchas'
const files = await fs.readdir(captchasFolder)
for (const file of files) {
  const realAnswer = path.basename(file, '.svg')

  const svgBuf = await fs.readFile(path.join(captchasFolder, file))
  const svgString = svgBuf.toString('utf8')
  const answer = solve(svgString)

  if (answer != realAnswer) {
    console.log('wrong answer, expect ', realAnser, 'got ', answer)
    continue
  }

  console.log(realAnswer)
}
