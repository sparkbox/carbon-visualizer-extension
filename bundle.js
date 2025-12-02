#!/usr/bin/env node

const esbuild = require('esbuild');
const path = require('path');

async function bundleCarbonCalculator() {
  try {
    console.log('📦 Bundling CarbonCalculator.js with dependencies...');

    await esbuild.build({
      entryPoints: [path.join(__dirname, 'src/core/CarbonCalculator.js')],
      bundle: true,
      format: 'esm',
      outfile: path.join(__dirname, 'src/core/CarbonCalculator.bundle.js'),
      platform: 'browser',
      target: 'es2020',
      external: [],
      minify: false,
      sourcemap: false,
    });

    console.log('✅ CarbonCalculator.js bundled successfully');
  } catch (error) {
    console.error('❌ Bundling failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  bundleCarbonCalculator();
}

module.exports = { bundleCarbonCalculator };

