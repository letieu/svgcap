import * as esbuild from 'esbuild';
import fs from 'fs';

async function build() {
  console.log('Building svgcap...');

  // Ensure dist directory exists
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }

  // Build ESM version of index
  await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'dist/index.js',
    packages: 'external',
  });

  // Build CommonJS version of index
  await esbuild.build({
    entryPoints: ['index.js'],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    outfile: 'dist/index.cjs',
    packages: 'external',
  });

  // Build CLI tool
  await esbuild.build({
    entryPoints: ['cli.js'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    outfile: 'dist/cli.js',
    packages: 'external',
    banner: {
      js: '#!/usr/bin/env node',
    },
  });

  // Make the CLI executable
  fs.chmodSync('dist/cli.js', '755');

  console.log('Build completed successfully!');
}

build().catch(err => {
  console.error('Build failed:', err);
  process.exit(1);
});
