#!/usr/bin/env node
// Vérifie que le poste peut jouer les exercices 1 et 2 de Relais.
// Lancé par `npm run verifier-poste` depuis 11-relais/application/.
// Une ligne par manque, avec la commande qui le corrige ; sinon une seule ligne.
'use strict';

const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const application = process.cwd();
const mac = process.platform === 'darwin';
const windows = process.platform === 'win32';
const manques = [];
let piloteAbsent = false;

function lancer(commande, args) {
  try {
    return execFileSync(commande, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
  } catch {
    return null;
  }
}

// 1. PHP 8.4 ou plus récent, et ses extensions.
const version = lancer('php', ['-r', 'echo PHP_MAJOR_VERSION.".".PHP_MINOR_VERSION;']);
if (version === null) {
  manques.push(mac ? 'PHP introuvable : brew install php' : windows ? 'PHP introuvable : winget install PHP.PHP.8.4, puis rouvrez le terminal' : 'PHP introuvable : installez PHP 8.4 ou plus récent (sudo apt install php-cli)');
} else {
  const [majeur, mineur] = version.split('.').map(Number);
  if (majeur < 8 || (majeur === 8 && mineur < 4)) {
    manques.push(`PHP ${version} trop ancien : il faut PHP 8.4 ou plus récent (${mac ? 'brew install php' : windows ? 'winget install PHP.PHP.8.4, puis rouvrez le terminal' : 'sudo apt install php8.5-cli, ou le dépôt php8.x de votre distribution'})`);
  }
  const modules = (lancer('php', ['-m']) || '').toLowerCase().split('\n').map((ligne) => ligne.trim());
  const paquets = { dom: 'xml', xml: 'xml', xmlwriter: 'xml', libxml: 'xml', tokenizer: 'common', iconv: 'common', json: 'common' };
  for (const [extension, paquet] of Object.entries(paquets)) {
    if (!modules.includes(extension)) {
      manques.push(`Extension PHP ${extension} absente : ${mac ? 'brew reinstall php' : windows ? 'ce PHP est incomplet : winget install PHP.PHP.8.4' : `sudo apt install php${version}-${paquet}`}`);
    }
  }
  if (!modules.includes('pcov') && !modules.includes('xdebug')) {
    piloteAbsent = true;
    manques.push(`Pilote de couverture absent (exercice 2) : ${mac ? 'pecl install pcov' : windows ? 'powershell -ExecutionPolicy Bypass -File ..\\outils\\installer-pcov.ps1' : `sudo apt install php${version}-pcov`}`);
  }
}

// 2. Dépendances PHP de l'application.
const outilsPhp = ['phpunit', 'infection'].filter((outil) => !fs.existsSync(path.join(application, 'vendor', 'bin', outil)));
if (outilsPhp.length > 0) {
  manques.push(`Dépendances PHP absentes (${outilsPhp.map((outil) => `vendor/bin/${outil}`).join(', ')}) : composer install`);
}

// 3. Playwright et son navigateur.
const playwright = path.join(application, 'node_modules', 'playwright-core');
if (!fs.existsSync(playwright)) {
  manques.push('Playwright absent : npm ci');
} else {
  let chemin = null;
  try {
    chemin = require(playwright).chromium.executablePath();
  } catch {
    chemin = null;
  }
  if (!chemin || !fs.existsSync(chemin)) {
    manques.push('Chromium de Playwright absent : npx playwright install chromium');
  }
}

// 4. Git et Claude Code.
if (lancer('git', ['--version']) === null) {
  manques.push(mac ? 'Git introuvable : xcode-select --install' : windows ? 'Git introuvable : winget install Git.Git, puis rouvrez le terminal' : 'Git introuvable : sudo apt install git');
}
if (lancer('claude', ['--version']) === null) {
  manques.push('Claude Code introuvable dans ce terminal : installez-le, puis rouvrez le terminal');
}

if (manques.length === 0) {
  console.log('Poste prêt pour les exercices 1 et 2.');
  process.exit(0);
}
for (const manque of manques) {
  console.log(manque);
}
if (manques.length === 1 && piloteAbsent) {
  console.log('Exercice 1 prêt. Exercice 2 : installez le pilote de couverture ci-dessus.');
} else {
  console.log(`Poste incomplet : ${manques.length} point(s) à corriger.`);
}
process.exit(1);
