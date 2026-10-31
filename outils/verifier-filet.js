// Fichier de la formation : ne pas modifier.
// Mesure la solidité des tests d'un exercice : on essaie quelques petites
// modifications du code d'origine et on compte celles que les tests détectent.
// Usage (depuis le sous-dossier de l'exercice) : npm run verifier-filet
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const exercice = process.argv[2];
if (!exercice) {
  console.error('Usage : node ../outils/verifier-filet.js <dossier-exercice>');
  process.exit(2);
}

const racine = path.join(__dirname, '..');
const dossierExercice = path.join(racine, exercice);
const { fichier, mutations } = require(path.join(__dirname, 'mutations', exercice + '.js'));
const origine = fs.readFileSync(path.join(__dirname, 'origines', exercice, fichier), 'utf8');

function fichiersDeTest(dossier) {
  if (!fs.existsSync(dossier)) return [];
  return fs
    .readdirSync(dossier, { recursive: true })
    .filter((nom) => nom.endsWith('.js'));
}

function lancerTests(dossier) {
  const resultat = spawnSync(
    process.execPath,
    ['--test', '--test-reporter=tap', 'test/**/*.js'],
    { cwd: dossier, encoding: 'utf8', timeout: 60000 },
  );
  const lire = (nom) => {
    const trouve = (resultat.stdout || '').match(new RegExp('^# ' + nom + ' (\\d+)$', 'm'));
    return trouve ? Number(trouve[1]) : 0;
  };
  return { vert: resultat.status === 0, reussis: lire('pass'), echoues: lire('fail') };
}

function pluriel(n, mot) {
  return n + ' ' + mot + (n > 1 ? 's' : '');
}

if (fichiersDeTest(path.join(dossierExercice, 'test')).length === 0) {
  console.log('Aucun test trouvé dans test/.');
  process.exit(0);
}

// Copie de travail : votre dossier n'est jamais modifié.
const copie = fs.mkdtempSync(path.join(os.tmpdir(), 'verifier-filet-'));
try {
  fs.cpSync(dossierExercice, copie, {
    recursive: true,
    filter: (source) => !/[\\/](node_modules|\.git)([\\/]|$)/.test(path.relative(racine, source)),
  });
  const cible = path.join(copie, fichier);
  fs.writeFileSync(cible, origine);

  const reference = lancerTests(copie);
  if (!reference.vert || reference.reussis === 0) {
    console.log(
      'Filet : ' + pluriel(reference.echoues, 'test') + ' au rouge sur le code d’origine. ' +
        'Un test de caractérisation décrit ce que le code fait aujourd’hui : rendez-le vert avant de mesurer le filet.',
    );
    process.exit(0);
  }

  const manquees = [];
  for (const mutation of mutations) {
    const morceaux = origine.split(mutation.chercher);
    if (morceaux.length !== 2) {
      throw new Error('Modification inapplicable (texte introuvable ou en double) : ' + mutation.comportement);
    }
    fs.writeFileSync(cible, morceaux.join(mutation.remplacer));
    if (lancerTests(copie).vert) manquees.push(mutation);
    fs.writeFileSync(cible, origine);
  }

  const detectees = mutations.length - manquees.length;
  console.log(
    'Filet : ' + pluriel(reference.reussis, 'test') + ' au vert sur le code d’origine ; ' +
      (reference.reussis > 1 ? 'ils détectent ' : 'il détecte ') + detectees + ' des ' + mutations.length + ' modifications essayées.',
  );
  for (const mutation of manquees) {
    console.log('- Non détectée : aucun test ne passe au rouge quand on modifie ' + mutation.comportement + '.');
  }
} finally {
  fs.rmSync(copie, { recursive: true, force: true });
}
