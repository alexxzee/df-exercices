// Fichier de la formation : ne pas modifier.
// Vérifie la page des devis du jour, GET /devis/du-jour, sur six cas.
// Usage (depuis le sous-dossier de l'exercice) : npm run devis-du-jour
// Les cas et leurs résultats attendus sont chiffrés : la clé est donnée dans la
// fiche de l'exercice et se saisit dans le terminal.
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const exercice = process.argv[2];
if (!exercice) {
  console.error('Usage : node ../outils/verifier-devis-du-jour.js <dossier-exercice>');
  process.exit(2);
}
const dossierExercice = path.join(__dirname, '..', exercice);
// Le contenu reste chiffré tant que la clé n'est pas saisie : un assistant qui lit
// l'espace de travail n'y trouve ni les cas essayés ni les résultats attendus.
const enveloppe = JSON.parse(fs.readFileSync(path.join(__dirname, 'attendus', exercice + '.chiffre.json'), 'utf8'));

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
  if (process.env.DEVIS_CLE) return process.env.DEVIS_CLE;
  if (!process.stdin.isTTY) {
    console.log(
      'Clé nécessaire : lancez npm run devis-du-jour vous-même, dans le terminal, et saisissez la clé écrite dans la fiche.',
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

function charger(fichier) {
  try {
    return require(path.join(dossierExercice, fichier));
  } catch (erreur) {
    console.log(fichier + ' ne se charge pas : ' + erreur.message.split('\n')[0]);
    console.log('Corrigez l’erreur signalée, enregistrez (Ctrl+S), puis relancez.');
    process.exit(1);
  }
}

async function verifier() {
  const contenu = dechiffrer(await demanderCle());
  if (!contenu) {
    console.log(
      'Clé incorrecte : la vérification ne s’ouvre pas. Vérifiez la clé écrite dans la fiche, puis relancez npm run devis-du-jour.',
    );
    process.exitCode = 1;
    return;
  }
  const { creerApp } = charger('src/app.js');
  const { creerDonnees } = charger('src/donnees.js');
  const AUJOURDHUI = new Date().toISOString().slice(0, 10);
  const HIER = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  const cas = new Function('contexte', contenu.cas)({ creerApp, creerDonnees, AUJOURDHUI, HIER });

  console.log('Test de ' + contenu.titre);
  let erreurs = 0;
  for (const { regle, juste, detail } of cas) {
    if (!juste) erreurs += 1;
    console.log('  ' + regle + ' : ' + (juste ? 'juste' : 'FAUX (' + detail + ')'));
  }
  console.log(
    erreurs === 0
      ? 'Bilan : les ' + cas.length + ' cas sont justes.'
      : 'Bilan : ' + erreurs + ' cas faux sur ' + cas.length + '.',
  );
  process.exitCode = erreurs === 0 ? 0 : 1;
}

verifier();
