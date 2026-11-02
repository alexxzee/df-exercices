// Fichier de la formation : ne pas modifier.
// Vérifie le résultat de l'exercice sur trois lignes : l'endroit où la règle est
// appliquée, la règle elle-même, et le test qui la protège.
// Usage (depuis le sous-dossier de l'exercice) : npm run verifier-explorer
// Les situations essayées et leurs résultats attendus sont chiffrés : la clé est
// donnée dans la fiche de l'exercice et se saisit dans le terminal.
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { Worker } = require('node:worker_threads');

const exercice = process.argv[2];
if (!exercice) {
  console.error('Usage : node ../outils/verifier-explorer.js <dossier-exercice>');
  process.exit(2);
}

const racine = path.join(__dirname, '..');
const dossierExercice = path.join(racine, exercice);
// Le contenu reste chiffré tant que la clé n'est pas saisie : un assistant qui lit
// l'espace de travail n'y trouve ni les situations essayées ni les résultats attendus.
const enveloppe = JSON.parse(fs.readFileSync(path.join(__dirname, 'attendus', exercice + '.chiffre.json'), 'utf8'));

function fichiersDeTest(dossier) {
  if (!fs.existsSync(dossier)) return [];
  return fs
    .readdirSync(dossier, { recursive: true })
    .filter((nom) => nom.endsWith('.js'))
    .map((nom) => path.join(dossier, nom));
}

// Tout tourne dans un fil d'exécution du même processus, sans lancer de second
// programme : le bac à sable de certains assistants l'interdit (Codex sous Linux).
const LANCEUR_TESTS = `
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

const LANCEUR_CALCUL = `
const { parentPort, workerData } = require('node:worker_threads');
const path = require('node:path');
try {
  const fonction = require(path.join(workerData.dossier, workerData.module))[workerData.fonction];
  const resultats = workerData.entrees.map((entree) => fonction(entree)[workerData.champ]);
  parentPort.postMessage({ resultats });
} catch (erreur) {
  parentPort.postMessage({ erreur: String(erreur && erreur.message ? erreur.message : erreur) });
}
`;

function lancer(code, donnees, parDefaut) {
  return new Promise((resolve) => {
    const fil = new Worker(code, { eval: true, workerData: donnees, stdout: true, stderr: true });
    fil.stdout.resume();
    fil.stderr.resume();
    const delai = setTimeout(() => fil.terminate(), 60000);
    let resultat = parDefaut;
    fil.once('message', (message) => {
      resultat = message;
    });
    fil.once('error', (erreur) => {
      resultat = { ...parDefaut, erreur: String(erreur && erreur.message ? erreur.message : erreur) };
    });
    fil.once('exit', () => {
      clearTimeout(delai);
      resolve(resultat);
    });
  });
}

function lancerTests(dossier) {
  const fichiers = fichiersDeTest(path.join(dossier, 'test'));
  return lancer(LANCEUR_TESTS, { dossier, fichiers }, { reussis: 0, echoues: 0 });
}

function calculer(dossier, cible, entrees) {
  return lancer(LANCEUR_CALCUL, { dossier, ...cible, entrees }, { erreur: 'calcul interrompu' });
}

// Montants comparés au centime près : 161.99 et 161.99000000000001 sont égaux.
function egal(a, b) {
  return typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 0.005;
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
  if (process.env.EXPLORER_CLE) return process.env.EXPLORER_CLE;
  if (!process.stdin.isTTY) {
    console.log(
      'Clé nécessaire : lancez npm run verifier-explorer vous-même, dans le terminal, ' +
        'et saisissez la clé écrite dans la fiche.',
    );
    process.exit(1);
  }
  return saisirMasque('Clé de la fiche (rien ne s’affiche pendant la frappe), puis Entrée : ');
}

function dechiffrer(cleSaisie) {
  const { N, r, p } = enveloppe.derivation;
  const cle = crypto.scryptSync(cleSaisie.trim().toLowerCase(), Buffer.from(enveloppe.sel, 'base64'), 32, {
    N,
    r,
    p,
    maxmem: 64 * 1024 * 1024,
  });
  const dechiffreur = crypto.createDecipheriv('aes-256-gcm', cle, Buffer.from(enveloppe.iv, 'base64'));
  dechiffreur.setAuthTag(Buffer.from(enveloppe.etiquette, 'base64'));
  try {
    const clair = Buffer.concat([dechiffreur.update(Buffer.from(enveloppe.donnees, 'base64')), dechiffreur.final()]);
    return JSON.parse(clair.toString('utf8'));
  } catch {
    return null;
  }
}

// Remet les fichiers d'origine du domaine visé : c'est « retirer la règle ».
function retirerRegle(copie, origines) {
  for (const [fichier, contenu] of Object.entries(origines)) {
    fs.writeFileSync(path.join(copie, fichier), contenu);
  }
}

function copier() {
  const copie = fs.mkdtempSync(path.join(os.tmpdir(), 'verifier-explorer-'));
  fs.cpSync(dossierExercice, copie, {
    recursive: true,
    filter: (source) => !/[\\/](node_modules|\.git|\.sauvegardes)([\\/]|$)/.test(path.relative(racine, source)),
  });
  return copie;
}

function ligneEndroit(change, devisInchange, attendus) {
  if (change && devisInchange) return { juste: true, texte: 'Endroit : juste. ' + attendus.endroitJuste };
  const raisons = [];
  if (!change) raisons.push(attendus.endroitInchange);
  if (!devisInchange) raisons.push(attendus.endroitDevis);
  return { juste: false, texte: 'Endroit : faux. ' + raisons.join(' ') };
}

async function ligneTest(copie, attendus) {
  const avant = await lancerTests(copie);
  if (avant.reussis === 0 && avant.echoues === 0) {
    return { juste: false, texte: 'Test : faux. Les tests n’ont pas pu tourner : lancez npm test pour voir l’erreur.' };
  }
  if (avant.echoues > 0) {
    return { juste: false, texte: 'Test : faux. ' + pluriel(avant.echoues, 'test') + ' au rouge sur votre code : lancez npm test.' };
  }
  retirerRegle(copie, attendus.origines);
  const apres = await lancerTests(copie);
  if (apres.echoues === 0) {
    return { juste: false, texte: 'Test : faux. Aucun test ne passe au rouge quand on retire la règle ' + attendus.domaine + '.' };
  }
  const verbe = apres.echoues > 1 ? ' passent' : ' passe';
  return { juste: true, texte: 'Test : juste. ' + pluriel(apres.echoues, 'test') + verbe + ' au rouge quand on retire la règle ' + attendus.domaine + '.' };
}

async function verifier() {
  if (fichiersDeTest(path.join(dossierExercice, 'test')).length === 0) {
    console.log('Aucun test trouvé dans test/.');
    return;
  }
  const attendus = dechiffrer(await demanderCle());
  if (!attendus) {
    console.log('Clé incorrecte : la vérification ne s’ouvre pas. Vérifiez la clé écrite dans la fiche, puis relancez npm run verifier-explorer.');
    process.exitCode = 1;
    return;
  }

  const copie = copier();
  const origine = copier();
  try {
    retirerRegle(origine, attendus.origines);
    const entrees = attendus.cas.map((cas) => cas.entree);
    const actuel = await calculer(copie, attendus.cible, entrees);
    if (actuel.erreur) {
      console.log('Le calcul ' + attendus.domaine + ' échoue (' + actuel.erreur + ') : lancez npm test pour voir l’erreur.');
      process.exitCode = 1;
      return;
    }
    const depart = await calculer(origine, attendus.cible, entrees);
    const devis = await calculer(copie, attendus.temoin, attendus.casTemoin.map((cas) => cas.entree));

    const change = actuel.resultats.some((valeur, i) => !egal(valeur, depart.resultats[i]));
    const devisInchange = !devis.erreur && devis.resultats.every((valeur, i) => egal(valeur, attendus.casTemoin[i].attendu));
    const fausses = attendus.cas.filter((cas, i) => !egal(actuel.resultats[i], cas.attendu));

    console.log('Vérification : ' + attendus.titre);
    const endroit = ligneEndroit(change, devisInchange, attendus);
    console.log(endroit.texte);
    console.log('Règle : ' + (attendus.cas.length - fausses.length) + ' situations justes sur ' + attendus.cas.length + '.');
    for (const cas of fausses) console.log('- Fausse : ' + cas.description + '.');
    const test = await ligneTest(copie, attendus);
    console.log(test.texte);
    const justes = [endroit.juste, fausses.length === 0, test.juste].filter(Boolean).length;
    console.log('Bilan : ' + justes + (justes > 1 ? ' lignes justes' : ' ligne juste') + ' sur 3.');
  } finally {
    fs.rmSync(copie, { recursive: true, force: true });
    fs.rmSync(origine, { recursive: true, force: true });
  }
}

verifier();
