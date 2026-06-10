import { train } from './train.js'
import fs from 'fs/promises'

const model = await train('./captchas')
console.log(model)

fs.writeFile('MODEL.json', JSON.stringify(model))
