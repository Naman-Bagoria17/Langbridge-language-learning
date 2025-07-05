#!/usr/bin/env node

// Fluento Project Setup Verification Script
// This script verifies that all required files and dependencies are properly set up

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying Fluento Project Setup...\n');

let hasErrors = false;

// Check if required files exist
const requiredFiles = [
  'BACKEND/package.json',
  'BACKEND/.env.example',
  'BACKEND/src/server.js',
  'FRONTEND/package.json',
  'FRONTEND/.env.example',
  'FRONTEND/src/main.jsx',
  'package.json',
  'README.md',
  '.gitignore'
];

console.log('📁 Checking required files...');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - MISSING`);
    hasErrors = true;
  }
});

// Check if node_modules exist
console.log('\n📦 Checking dependencies...');
const nodeModulesPaths = [
  'node_modules',
  'BACKEND/node_modules',
  'FRONTEND/node_modules'
];

nodeModulesPaths.forEach(dir => {
  const dirPath = path.join(__dirname, dir);
  if (fs.existsSync(dirPath)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`⚠️  ${dir} - Run 'npm install' in the respective directory`);
  }
});

// Check environment files
console.log('\n🔧 Checking environment configuration...');
const envFiles = [
  'BACKEND/.env',
  'FRONTEND/.env'
];

envFiles.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`⚠️  ${file} - Copy from ${file}.example and configure`);
  }
});

// Check package.json scripts
console.log('\n📜 Checking package.json scripts...');
try {
  const backendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'BACKEND/package.json'), 'utf8'));
  const frontendPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'FRONTEND/package.json'), 'utf8'));
  const rootPkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

  if (backendPkg.scripts?.dev && backendPkg.scripts?.start) {
    console.log('✅ Backend scripts configured');
  } else {
    console.log('❌ Backend scripts missing');
    hasErrors = true;
  }

  if (frontendPkg.scripts?.dev && frontendPkg.scripts?.build) {
    console.log('✅ Frontend scripts configured');
  } else {
    console.log('❌ Frontend scripts missing');
    hasErrors = true;
  }

  if (rootPkg.scripts?.build && rootPkg.scripts?.start) {
    console.log('✅ Root scripts configured');
  } else {
    console.log('❌ Root scripts missing');
    hasErrors = true;
  }
} catch (error) {
  console.log('❌ Error reading package.json files');
  hasErrors = true;
}

// Summary
console.log('\n' + '='.repeat(50));
if (hasErrors) {
  console.log('❌ Setup verification failed. Please fix the issues above.');
  console.log('\n📋 Next steps:');
  console.log('1. Run setup script: ./setup.sh (Unix/Mac) or ./setup.ps1 (Windows)');
  console.log('2. Configure environment variables');
  console.log('3. Set up MongoDB and Stream.io accounts');
} else {
  console.log('✅ Setup verification passed!');
  console.log('\n🚀 Ready to start development:');
  console.log('Backend:  cd BACKEND && npm run dev');
  console.log('Frontend: cd FRONTEND && npm run dev');
}

console.log('\n📚 For detailed setup instructions, see README.md');
console.log('🌍 Happy language learning!');

process.exit(hasErrors ? 1 : 0);
