// Fichier de la formation : ne pas modifier.
// Mesure la solidité des tests d'un exercice : on essaie quelques petites
// modifications du code d'origine et on compte celles que les tests détectent.
// Usage (depuis le sous-dossier de l'exercice) : npm run verifier-filet
'use strict';

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

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

// Les tests tournent dans un fil d'exécution du même processus, sans lancer un
// second programme : le bac à sable de certains assistants l'interdit (Codex sous
// Linux répond EPERM), et ils doivent pouvoir mesurer le filet eux aussi.
const LANCEUR = `
const { parentPort, workerData } = require('node:worker_threads');
const { run } = require('node:test');
let reussis = 0;
let echoues = 0;
const flux = run({ files: workerData.fichiers, cwd: workerData.dossier, isolation: 'none' });
flux.on('test:pass', (e) => { if (e.details.type !== 'suite') reussis++; });
flux.on('test:fail', (e) => { if (e.details.type !== 'suite') echoues++; });
flux.on('end', () => parentPort.postMessage({ reussis, echoues }));
flux.resume();
`;

function lancerTests(dossier) {
  const fichiers = fichiersDeTest(path.join(dossier, 'test')).map((nom) => path.join(dossier, 'test', nom));
  return new Promise((resolve) => {
    const fil = new Worker(LANCEUR, { eval: true, workerData: { dossier, fichiers }, stdout: true, stderr: true });
    fil.stdout.resume();
    fil.stderr.resume();
    // Une modification qui fait tourner le code en boucle compte comme détectée.
    const delai = setTimeout(() => fil.terminate(), 60000);
    let resultat = { vert: false, reussis: 0, echoues: 0 };
    fil.once('message', ({ reussis, echoues }) => {
      resultat = { vert: echoues === 0, reussis, echoues };
    });
    fil.once('exit', () => {
      clearTimeout(delai);
      resolve(resultat);
    });
  });
}

function pluriel(n, mot) {
  return n + ' ' + mot + (n > 1 ? 's' : '');
}

if (fichiersDeTest(path.join(dossierExercice, 'test')).length === 0) {
  console.log('Aucun test trouvé dans test/.');
  process.exit(0);
}

async function mesurer() {
  // Copie de travail : votre dossier n'est jamais modifié.
  const copie = fs.mkdtempSync(path.join(os.tmpdir(), 'verifier-filet-'));
  try {
    fs.cpSync(dossierExercice, copie, {
      recursive: true,
      filter: (source) => !/[\\/](node_modules|\.git)([\\/]|$)/.test(path.relative(racine, source)),
    });
    const cible = path.join(copie, fichier);
    fs.writeFileSync(cible, origine);

    const reference = await lancerTests(copie);
    if (reference.reussis === 0 && reference.echoues === 0) {
      console.log('Les tests n’ont pas pu tourner : lancez npm test pour voir l’erreur.');
      return;
    }
    if (!reference.vert || reference.reussis === 0) {
      console.log(
        'Filet : ' + pluriel(reference.echoues, 'test') + ' au rouge sur le code d’origine. ' +
          'Un test de caractérisation décrit ce que fait le code d’origine : s’il est rouge sur ce code, ' +
          'soit il est faux, soit il a été modifié pour suivre un changement de comportement (git diff -- test/ le montre).',
      );
      return;
    }

    const manquees = [];
    for (const mutation of mutations) {
      const morceaux = origine.split(mutation.chercher);
      if (morceaux.length !== 2) {
        throw new Error('Modification inapplicable (texte introuvable ou en double) : ' + mutation.comportement);
      }
      fs.writeFileSync(cible, morceaux.join(mutation.remplacer));
      if ((await lancerTests(copie)).vert) manquees.push(mutation);
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
}

mesurer();
