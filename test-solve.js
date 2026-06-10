import fs from 'fs'
import { solve } from './solve.js'

const svgStr = fs.readFileSync('./captchas/3EDK9P.svg').toString('utf8')
const result = solve(svgStr)

console.log(result)
