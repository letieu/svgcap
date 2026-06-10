#!/usr/bin/env node

import fs from 'fs/promises';
import { solve } from './solve.js';
import { train } from './train.js';

const [,, command, ...args] = process.argv;

async function printHelp() {
  console.log(`
svgcap - SVG Captcha Solver and Trainer

Usage:
  npx svgcap solve <svg-file> [model-file]
  npx svgcap train <captchas-dir> [output-model-file]

Examples:
  npx svgcap solve captcha.svg
  npx svgcap solve captcha.svg my-model.json
  npx svgcap train ./captchas
  npx svgcap train ./captchas my-model.json
`);
}

async function main() {
  if (!command || command === '-h' || command === '--help') {
    await printHelp();
    return;
  }

  if (command === 'solve') {
    const svgPath = args[0];
    const modelPath = args[1];

    if (!svgPath) {
      console.error('Error: Please specify the SVG file path.');
      await printHelp();
      process.exit(1);
    }

    try {
      const svgString = await fs.readFile(svgPath, 'utf8');
      let model;
      if (modelPath) {
        const modelContent = await fs.readFile(modelPath, 'utf8');
        model = JSON.parse(modelContent);
      }
      const result = solve(svgString, model);
      console.log(result);
    } catch (err) {
      console.error(`Error: Failed to solve captcha. ${err.message}`);
      process.exit(1);
    }
  } else if (command === 'train') {
    const captchasDir = args[0];
    const outputPath = args[1] || 'MODEL.json';

    if (!captchasDir) {
      console.error('Error: Please specify the directory containing SVG captchas.');
      await printHelp();
      process.exit(1);
    }

    try {
      console.log(`Training on SVGs in: ${captchasDir}...`);
      const model = await train(captchasDir);
      await fs.writeFile(outputPath, JSON.stringify(model, null, 2));
      console.log(`Successfully trained model saved to: ${outputPath}`);
    } catch (err) {
      console.error(`Error: Failed to train model. ${err.message}`);
      process.exit(1);
    }
  } else {
    console.error(`Unknown command: ${command}`);
    await printHelp();
    process.exit(1);
  }
}

main();
