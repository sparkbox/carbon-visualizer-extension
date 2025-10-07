#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// Check if archiver is available, if not, provide instructions
try {
  require.resolve('archiver');
} catch (e) {
  console.log('archiver package not found. Installing...');
  console.log('Run: npm install archiver');
  process.exit(1);
}

const buildDir = 'build';
const chromeDir = path.join(buildDir, 'chrome');
const firefoxDir = path.join(buildDir, 'firefox');

// Files to copy for both versions
const commonFiles = [
  'content.js',
  'background.js',
  'src/',
  'icons/'
];

// Create build directories
function createDirectories() {
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir);
  }
  if (!fs.existsSync(chromeDir)) {
    fs.mkdirSync(chromeDir);
  }
  if (!fs.existsSync(firefoxDir)) {
    fs.mkdirSync(firefoxDir);
  }
}

// Copy common files
function copyCommonFiles() {
  commonFiles.forEach(file => {
    const source = file;
    const chromeDest = path.join(chromeDir, file);
    const firefoxDest = path.join(firefoxDir, file);
    
    if (fs.lstatSync(source).isDirectory()) {
      // Copy directory recursively
      copyDirectoryRecursive(source, chromeDest);
      copyDirectoryRecursive(source, firefoxDest);
    } else {
      // Copy file
      fs.copyFileSync(source, chromeDest);
      fs.copyFileSync(source, firefoxDest);
    }
  });
}

function copyDirectoryRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDirectoryRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}

// Copy manifest files
function copyManifests() {
  // Copy base manifest to both builds
  fs.copyFileSync('manifest.json', path.join(chromeDir, 'manifest.json'));
  fs.copyFileSync('manifest.json', path.join(firefoxDir, 'manifest.json'));
}

// Patch Firefox manifest for browser-specific settings
function patchFirefoxManifest() {
  const firefoxManifestPath = path.join(firefoxDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(firefoxManifestPath, 'utf-8'));

  // Change service_worker to scripts for background
  manifest.background.scripts = [manifest.background.service_worker];
  delete manifest.background.service_worker;

  // Add browser-specific settings for Firefox
  manifest.browser_specific_settings = {
    gecko: {
      "id": "carbon-visualizer@heysparkbox.com"
    }
  };

  fs.writeFileSync(firefoxManifestPath, JSON.stringify(manifest, null, 2));
}

// Create ZIP files
function createZips() {
  return new Promise((resolve, reject) => {
    const chromeZip = fs.createWriteStream(path.join(buildDir, 'carbon-visualizer-chrome.zip'));
    const firefoxZip = fs.createWriteStream(path.join(buildDir, 'carbon-visualizer-firefox.zip'));
    
    const chromeArchive = archiver('zip', { zlib: { level: 9 } });
    const firefoxArchive = archiver('zip', { zlib: { level: 9 } });
    
    chromeZip.on('close', () => {
      console.log('✅ Chrome extension packaged: build/carbon-visualizer-chrome.zip');
    });
    
    firefoxZip.on('close', () => {
      console.log('✅ Firefox extension packaged: build/carbon-visualizer-firefox.zip');
    });
    
    chromeArchive.on('error', reject);
    firefoxArchive.on('error', reject);
    
    chromeArchive.pipe(chromeZip);
    firefoxArchive.pipe(firefoxZip);
    
    chromeArchive.directory(chromeDir, false);
    firefoxArchive.directory(firefoxDir, false);
    
    chromeArchive.finalize();
    firefoxArchive.finalize();
    
    Promise.all([
      new Promise(resolve => chromeArchive.on('end', resolve)),
      new Promise(resolve => firefoxArchive.on('end', resolve))
    ]).then(resolve);
  });
}

// Main build function
async function build() {
  try {
    console.log('🚀 Building Carbon Visualizer extension for Chrome and Firefox...');
    
    createDirectories();
    copyCommonFiles();
    copyManifests();
    patchFirefoxManifest();
    
    await createZips();
    
    console.log('\n🎉 Build complete!');
    console.log('\n📦 Extension packages created:');
    console.log('   Chrome: build/carbon-visualizer-chrome.zip');
    console.log('   Firefox: build/carbon-visualizer-firefox.zip');
    console.log('\n📋 Installation instructions:');
    console.log('   Chrome: Load unpacked from build/chrome/');
    console.log('   Firefox: Load temporary add-on from build/firefox/');
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

// Run build if called directly
if (require.main === module) {
  build();
}

module.exports = { build };
