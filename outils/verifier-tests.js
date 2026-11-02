// Fichier de la formation : ne pas modifier.
// Mesure ce que vérifient vraiment les tests d'un exercice : on les lance sur un
// code conforme à la spec, puis sur des copies de ce code où un écart à la spec a
// été glissé, et on compte les écarts que les tests détectent.
// Usage (depuis le sous-dossier de l'exercice) : npm run verifier-tests
// Le code conforme et les écarts sont chiffrés : la clé est donnée par le
// formateur, et se saisit dans le terminal.
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const exercice = process.argv[2];
if (!exercice) {
  console.error('Usage : node ../outils/verifier-tests.js <dossier-exercice>');
  process.exit(2);
}

const racine = path.join(__dirname, '..');
const dossierExercice = path.join(racine, exercice);
// Tout reste chiffré tant que la clé n'est pas saisie : un assistant qui lit
// l'espace de travail n'y trouve ni le code conforme ni les écarts essayés.
const liste = JSON.parse(fs.readFileSync(path.join(__dirname, 'mutations', exercice + '.chiffre.json'), 'utf8'));
const fichier = liste.fichier;

function fichiersDeTest(dossier) {
  if (!fs.existsSync(dossier)) return [];
  return fs
    .readdirSync(dossier, { recursive: true })
    .filter((nom) => nom.endsWith('.js'));
}

// Les tests tournent dans un fil d'exécution du même processus, sans lancer un
// second programme : le bac à sable de certains assistants l'interdit.
// Chaque test est repéré par son fichier et son nom, pour savoir lequel change.
const LANCEUR = `
const path = require('node:path');
const { parentPort, workerData } = require('node:worker_threads');
const { run } = require('node:test');
const verts = [];
const rouges = [];
const repere = (e) => path.relative(workerData.dossier, e.file || '') + '\\u0000' + e.name;
const flux = run({ files: workerData.fichiers, cwd: workerData.dossier, isolation: 'none' });
flux.on('test:pass', (e) => { if (e.details.type !== 'suite') verts.push(repere(e)); });
flux.on('test:fail', (e) => { if (e.details.type !== 'suite') rouges.push(repere(e)); });
flux.on('end', () => parentPort.postMessage({ verts, rouges }));
flux.resume();
`;

function lancerTests(dossier) {
  const fichiers = fichiersDeTest(path.join(dossier, 'test')).map((nom) => path.join(dossier, 'test', nom));
  return new Promise((resolve) => {
    const fil = new Worker(LANCEUR, { eval: true, workerData: { dossier, fichiers }, stdout: true, stderr: true });
    fil.stdout.resume();
    fil.stderr.resume();
    // Un écart qui fait tourner le code en boucle compte comme détecté.
    const delai = setTimeout(() => fil.terminate(), 60000);
    let resultat = { verts: [], rouges: [], interrompu: true };
    fil.once('message', ({ verts, rouges }) => {
      resultat = { verts, rouges, interrompu: false };
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

// Saisie masquée : rien ne s'affiche pendant la frappe.
function saisirMasque(question) {
  return new Promise((resolve) => {
    const entree = process.stdin;
    process.stdout.write(question);
    entree.setRawMode(true);
    entree.setEncoding('utf8');
    entree.resume();
    let tape = '';
    const lire = (morceau) => {
      for (const car of morceau) {
        if (car === '\r' || car === '\n') {
          entree.setRawMode(false);
          entree.pause();
          entree.removeListener('data', lire);
          process.stdout.write('\n');
          resolve(tape);
          return;
        }
        if (car === '\u0003') {
          entree.setRawMode(false);
          process.stdout.write('\n');
          process.exit(130);
        }
        if (car === '\u007f' || car === '\b') tape = tape.slice(0, -1);
        else tape += car;
      }
    };
    entree.on('data', lire);
  });
}

async function demanderCle() {
  // Variable d'environnement : pour les tests automatisés du formateur.
  if (process.env.VERIFIER_CLE) return process.env.VERIFIER_CLE;
  if (!process.stdin.isTTY) {
    console.log(
      'Clé du formateur nécessaire : lancez npm run verifier-tests vous-même, dans le terminal, ' +
        'et saisissez la clé que donne le formateur.',
    );
    process.exit(1);
  }
  return saisirMasque('Clé du formateur (rien ne s’affiche pendant la frappe), puis Entrée : ');
}

function dechiffrer(cleSaisie) {
  const { N, r, p } = liste.derivation;
  const cle = crypto.scryptSync(cleSaisie.trim().toLowerCase(), Buffer.from(liste.sel, 'base64'), 32, {
    N,
    r,
    p,
    maxmem: 64 * 1024 * 1024,
  });
  const dechiffreur = crypto.createDecipheriv('aes-256-gcm', cle, Buffer.from(liste.iv, 'base64'));
  dechiffreur.setAuthTag(Buffer.from(liste.etiquette, 'base64'));
  try {
    const clair = Buffer.concat([dechiffreur.update(Buffer.from(liste.donnees, 'base64')), dechiffreur.final()]);
    return JSON.parse(clair.toString('utf8'));
  } catch {
    return null;
  }
}

if (fichiersDeTest(path.join(dossierExercice, 'test')).length === 0) {
  console.log('Aucun test trouvé dans test/.');
  process.exit(0);
}

async function mesurer() {
  const contenu = dechiffrer(await demanderCle());
  if (!contenu) {
    console.log(
      'Clé incorrecte : le code conforme et les écarts ne s’ouvrent pas. ' +
        'Vérifiez la clé donnée par le formateur, puis relancez npm run verifier-tests.',
    );
    process.exitCode = 1;
    return;
  }
  const { conforme, ecarts } = contenu;

  // Copie de travail : votre dossier n'est jamais modifié.
  const copie = fs.mkdtempSync(path.join(os.tmpdir(), 'verifier-tests-'));
  try {
    fs.cpSync(dossierExercice, copie, {
      recursive: true,
      filter: (source) => !/[\\/](node_modules|\.git)([\\/]|$)/.test(path.relative(racine, source)),
    });
    const cible = path.join(copie, fichier);
    fs.writeFileSync(cible, conforme);

    const reference = await lancerTests(copie);
    if (reference.interrompu || reference.verts.length + reference.rouges.length === 0) {
      console.log('Les tests n’ont pas pu tourner : lancez npm test pour voir l’erreur.');
      return;
    }
    const vertsDeReference = new Set(reference.verts);

    // Un écart est détecté si au moins un test vert sur le code conforme passe au rouge.
    const manques = new Map();
    let detectes = 0;
    for (const ecart of ecarts) {
      const morceaux = conforme.split(ecart.chercher);
      if (morceaux.length !== 2) {
        throw new Error('Écart inapplicable (texte introuvable ou en double), paragraphe ' + ecart.paragraphe);
      }
      fs.writeFileSync(cible, morceaux.join(ecart.remplacer));
      const essai = await lancerTests(copie);
      const detecte = essai.interrompu || essai.rouges.some((test) => vertsDeReference.has(test));
      if (detecte) detectes++;
      else {
        const cle = ecart.paragraphe + '\u0000' + ecart.regle;
        manques.set(cle, (manques.get(cle) || 0) + 1);
      }
      fs.writeFileSync(cible, conforme);
    }

    const n = reference.verts.length;
    console.log(
      'Tests : ' + n + ' vert' + (n > 1 ? 's' : '') + ' sur un code conforme ; ' +
        (n > 1 ? 'ils détectent ' : 'il détecte ') + detectes + ' des ' + ecarts.length + ' écarts essayés.',
    );
    for (const test of reference.rouges) {
      const [fichierTest, nom] = test.split('\u0000');
      console.log(
        '- Rouge sur un code conforme : "' + nom + '" (' + fichierTest + '). ' +
          'Ce test affirme un comportement contraire à la spec.',
      );
    }
    for (const [cle, nombre] of manques) {
      const [paragraphe, regle] = cle.split('\u0000');
      console.log(
        '- Non détecté : ' + pluriel(nombre, 'écart') + ' glissé' + (nombre > 1 ? 's' : '') +
          ' dans le paragraphe ' + paragraphe + ' de la spec (' + regle + ').',
      );
    }
  } finally {
    fs.rmSync(copie, { recursive: true, force: true });
  }
}

mesurer();
