# svgcap

A lightweight, zero-dependency JavaScript package and Command Line Interface (CLI) to **solve** and **train** SVG captchas.

## Features

- **Solve Captchas**: Extract character codes from SVG captcha strings using a pattern-recognition model.
- **Train Models**: Generate custom pattern-recognition models from a directory of labeled SVG captchas.
- **Lightweight**: Zero external dependencies (only uses `@xmldom/xmldom` to parse SVG documents).
- **Dual Package (ESM & CommonJS)**: Fully supports both `import` and `require()` natively in Node.js.
- **CLI Support**: Use it as a library in your JavaScript code or run it directly from your terminal.

---

## Installation

Install via `npm`:

```bash
npm install svgcap
```

---

## Programmatic Usage

`svgcap` supports both ES Modules (ESM) and CommonJS (CJS) natively out of the box.

### 1. Solve a Captcha

By default, `solve` uses a built-in pre-trained model (`defaultModel`) that resolves characters based on their SVG path patterns.

#### ES Modules (ESM)
```javascript
import { solve } from 'svgcap';

// Your SVG captcha source string
const svgString = `<svg ...> ... </svg>`;

// Solve using the default model
const code = solve(svgString);
console.log('Solved Captcha:', code);
```

#### CommonJS (CJS)
```javascript
const { solve } = require('svgcap');

// Your SVG captcha source string
const svgString = `<svg ...> ... </svg>`;

// Solve using the default model
const code = solve(svgString);
console.log('Solved Captcha:', code);
```

---

### 2. Solve with a Custom Model

If you have trained a custom model and saved it as a JSON file, you can pass it to the `solve` function:

#### ES Modules (ESM)
```javascript
import fs from 'fs/promises';
import { solve } from 'svgcap';

const svgString = `<svg ...> ... </svg>`;

// Load custom model
const modelData = await fs.readFile('./my-model.json', 'utf8');
const customModel = JSON.parse(modelData);

// Solve using custom model
const code = solve(svgString, customModel);
console.log('Solved Captcha:', code);
```

#### CommonJS (CJS)
```javascript
const fs = require('fs/promises');
const { solve } = require('svgcap');

const svgString = `<svg ...> ... </svg>`;

async function run() {
  // Load custom model
  const modelData = await fs.readFile('./my-model.json', 'utf8');
  const customModel = JSON.parse(modelData);

  // Solve using custom model
  const code = solve(svgString, customModel);
  console.log('Solved Captcha:', code);
}
run();
```

---

### 3. Train a Model

You can train a model programmatically by pointing the `train` function to a folder of labeled captcha SVGs. The name of each SVG file in the directory should be the exact text of the captcha (e.g. `3EDK9P.svg`).

#### ES Modules (ESM)
```javascript
import fs from 'fs/promises';
import { train } from 'svgcap';

// Train a model from the folder containing labeled SVGs
const newModel = await train('./path/to/captchas');

// Save the trained model to a file
await fs.writeFile('my-model.json', JSON.stringify(newModel, null, 2));
console.log('Model trained and saved successfully!');
```

#### CommonJS (CJS)
```javascript
const fs = require('fs/promises');
const { train } = require('svgcap');

async function run() {
  // Train a model from the folder containing labeled SVGs
  const newModel = await train('./path/to/captchas');

  // Save the trained model to a file
  await fs.writeFile('my-model.json', JSON.stringify(newModel, null, 2));
  console.log('Model trained and saved successfully!');
}
run();
```

---

### 4. Train a Single SVG

If you want to map characters of a single SVG captcha to a known answer:

```javascript
// ESM
import { trainSvg } from 'svgcap';
// CJS: const { trainSvg } = require('svgcap');

const svgString = `<svg ...> ... </svg>`;
const answer = '3EDK9P';

const singleModelPart = trainSvg(svgString, answer);
// Returns an object mapping SVG path patterns to characters
console.log(singleModelPart);
```

---

## Command Line Interface (CLI)

You can run `svgcap` directly without installing it globally using `npx`.

### 1. Solve an SVG Captcha

Solve a single SVG file using the default model:

```bash
npx svgcap solve captcha.svg
```

Solve using a custom model file:

```bash
npx svgcap solve captcha.svg my-model.json
```

### 2. Train a Model

Generate a pattern model from a directory of labeled SVG captchas:

```bash
npx svgcap train ./path/to/captchas [output-model.json]
```

*If no output path is provided, it defaults to saving as `MODEL.json` in the current working directory.*

---

## File Labeled Captchas Example

To train a model, compile a folder of captchas named after their answers, for example:
```
captchas/
├── 3EDK9P.svg
├── 4AB7CD.svg
└── 9XYZ12.svg
```

---

## License

[ISC](LICENSE)
