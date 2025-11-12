#!/usr/bin/env node

const { execSync } = require('child_process');
const { readFileSync } = require('fs');
const { join } = require('path');

// Load .env file if it exists
try {
  const envFile = readFileSync(join(__dirname, '.env'), 'utf8');
  envFile.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      const value = valueParts.join('=').trim();
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = value;
      }
    }
  });
} catch (error) {
  // .env file doesn't exist or can't be read, that's okay
}

const token = process.env.OPEN_VSX_TOKEN;

if (!token) {
  console.error('Error: OPEN_VSX_TOKEN environment variable is not set');
  process.exit(1);
}

try {
  console.log('Publishing to Open VSX...');
  execSync(`npx ovsx publish -p ${token}`, { stdio: 'inherit' });
  console.log('Successfully published to Open VSX!');
} catch (error) {
  console.error('Failed to publish to Open VSX:', error.message);
  process.exit(1);
}

