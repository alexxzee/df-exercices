// Fichier de la formation : ne pas modifier.
// Vérifie une fonction d'exercice sur des situations écrites par la formation,
// et non par l'assistant : on compte les situations où elle donne le bon résultat.
// Usage (depuis le sous-dossier de l'exercice) : npm run verifier
// Les situations sont chiffrées : la clé est donnée par le formateur au moment
// de la vérification, et se saisit dans le terminal.
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const exercice = process.argv[2];
if (!exercice) {
  console.error('Usage : node ../outils/verifier-cas.js <dossier-exercice>');
  process.exit(2);
}

const dossierExercice = path.join(__dirname, '..', exercice);
// Les situations restent chiffrées tant que la clé n'est pas saisie : un assistant
// qui lit l'espace de travail n'y trouve ni les cas limites ni les résultats attendus.
const liste = JSON.parse(fs.readFileSync(path.join(__dirname, 'cas', exercice + '.chiffre.json'), 'utf8'));
const cheminModule = path.join(dossierExercice, liste.module);

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
      'Clé du formateur nécessaire : lancez npm run verifier vous-même, dans le terminal, ' +
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

function chargerFonction() {
  if (!fs.existsSync(cheminModule)) {
    console.log('Fichier ' + liste.module + ' introuvable : la fonction ' + liste.fonction + ' n’est pas encore écrite.');
    process.exit(1);
  }
  let module;
  try {
    module = require(cheminModule);
  } catch (erreur) {
    console.log('Le fichier ' + liste.module + ' ne se charge pas : ' + erreur.message);
    console.log('Lancez npm test pour voir l’erreur complète.');
    process.exit(1);
  }
  const fonction = typeof module === 'function' ? module : module[liste.fonction];
  if (typeof fonction !== 'function') {
    console.log(
      'Le fichier ' + liste.module + ' n’exporte pas de fonction ' + liste.fonction +
        ' : ajoutez module.exports = { ' + liste.fonction + ' }.',
    );
    process.exit(1);
  }
  return fonction;
}

async function verifier() {
  const fonction = chargerFonction();
  const situations = dechiffrer(await demanderCle());
  if (!situations) {
    console.log('Clé incorrecte : les situations ne s’ouvrent pas. Vérifiez la clé donnée par le formateur, puis relancez npm run verifier.');
    process.exitCode = 1;
    return;
  }
  let justes = 0;
  for (const situation of situations) {
    // Chaque situation reçoit sa propre copie : une fonction qui modifie la commande
    // ne fausse pas les suivantes.
    const commande = structuredClone(situation.commande);
    try {
      if (fonction(commande) === situation.attendu) justes++;
      else console.log('La situation "' + situation.nom + '" donne une date fausse.');
    } catch (erreur) {
      console.log('La situation "' + situation.nom + '" provoque une erreur : ' + erreur.message);
    }
  }
  console.log('Vérification : ' + justes + ' situation' + (justes > 1 ? 's' : '') + ' juste' + (justes > 1 ? 's' : '') + ' sur ' + situations.length + '.');
  if (justes !== situations.length) process.exitCode = 1;
}

verifier();
