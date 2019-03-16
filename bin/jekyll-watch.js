#!/usr/bin/env node
const path = require('path');
const execSync = require('child_process').execSync;
const jekpackRoot = path.join(__dirname, '..');
const env = Object.assign({}, process.env);

const APP_PATH = process.cwd();
const sourcePath = path.join(APP_PATH, 'src');
const distPath = path.join(APP_PATH, 'tmp/dist');

try {
  execSync(`bundle exec jekyll build -s ${sourcePath} -d ${distPath} --watch --config config/jekyll.yml`, {
    cwd: jekpackRoot,
    env,
    stdio: 'inherit'
  });
} catch (e) {
  process.exit(1);
}

