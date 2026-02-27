#!/usr/bin/env node

/**
 * Electron Builder Script
 * Builds the Electron app with installer and unpacked version
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building DocMark Electron App...\n');

// Step 1: Check if dist folder exists
if (!fs.existsSync('dist')) {
  console.log('📦 Building web app first...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Web build failed');
    process.exit(1);
  }
}

// Step 2: Check if electron-builder is available
console.log('\n🔍 Checking for electron-builder...');
try {
  execSync('electron-builder --version', { stdio: 'pipe' });
  console.log('✅ electron-builder found');
} catch (error) {
  console.log('⚠️  electron-builder not installed locally');
  console.log('📝 You can install it with: npm install --save-dev electron-builder');
  console.log('   Or use your system electron-builder if available\n');
}

// Step 3: Build with electron-builder
console.log('\n📦 Building Electron app...');
try {
  execSync('electron-builder --win --publish never', { stdio: 'inherit' });
  console.log('\n✅ Build complete!');
} catch (error) {
  console.error('\n❌ Build failed');
  console.error('Make sure electron-builder is installed:');
  console.error('  npm install --save-dev electron-builder');
  process.exit(1);
}

// Step 4: Check output
console.log('\n📂 Build artifacts:');
const distElectron = 'dist-electron';
if (fs.existsSync(distElectron)) {
  const files = fs.readdirSync(distElectron);
  files.forEach(file => {
    const filePath = path.join(distElectron, file);
    const stat = fs.statSync(filePath);
    const size = (stat.size / 1024 / 1024).toFixed(2);
    console.log(`   ✅ ${file} (${size} MB)`);
  });
} else {
  console.log('   ⚠️  dist-electron folder not found');
}

console.log('\n🎉 Done!');
