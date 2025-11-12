#!/usr/bin/env node

const { execSync } = require('child_process');

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

