// Fichier de la formation : ne pas modifier.
// Compare le tableau d'audit de AUDIT.md aux emplacements des failles attendues.
// Usage (depuis le sous-dossier de l'exercice) : npm run verifier-audit
// Les emplacements attendus sont chiffrés : la clé est donnée par le formateur
// au moment de la mesure, et se saisit dans le terminal.
'use strict';

const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');

const exercice = process.argv[2];
if (!exercice) {
  console.error('Usage : node ../outils/verifier-audit.js <dossier-exercice>');
  process.exit(2);
}

const racine = path.join(__dirname, '..');
const dossierExercice = path.join(racine, exercice);
// Les emplacements restent chiffrés tant que la clé n'est pas saisie : un assistant
// qui lit l'espace de travail n'y trouve pas les lignes des failles.
const attendus = JSON.parse(fs.readFileSync(path.join(__dirname, 'attendus', exercice + '.chiffre.json'), 'utf8'));

// Une plage plus longue ne désigne plus un endroit du code : elle ne localise rien.
const PLAGE_MAX = 10;

function pluriel(n, mot) {
  return n + ' ' + mot + (n > 1 ? 's' : '');
}

// Le tableau d'audit : les lignes qui commencent par « | », jusqu'à la première section « ## » qui suit le tableau.
// Le texte autour (phrases et titres de l'auditeur, verdict) est ignoré : la réponse se colle entière.
function lignesDuTableau(texte) {
  const debut = texte.split(/\r?\n/);
  const lignes = [];
  for (const ligne of debut) {
    if (/^##\s/.test(ligne)) {
      if (lignes.length > 0) break;
      continue;
    }
    if (/^\s*\|/.test(ligne)) lignes.push(ligne);
  }
  return lignes;
}

function cellules(ligne) {
  return ligne.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

// Chaque emplacement cité : un numéro seul (107) ou une plage (97-99, 97 à 99).
function emplacements(cellule) {
  const trouves = [];
  const motif = /(\d+)(?:\s*(?:-|à|a|to|\u2013)\s*(\d+))?/g;
  let m;
  while ((m = motif.exec(cellule)) !== null) {
    const debut = Number(m[1]);
    const fin = m[2] ? Number(m[2]) : debut;
    trouves.push([Math.min(debut, fin), Math.max(debut, fin)]);
  }
  return trouves;
}

function citations(texte) {
  const lignes = lignesDuTableau(texte);
  if (lignes.length < 2) return [];
  const entete = cellules(lignes[0]);
  const colonne = entete.findIndex((c) => /ligne|emplacement/i.test(c));
  const vues = new Map();
  for (const ligne of lignes.slice(1)) {
    if (/^\s*\|?\s*:?-{2,}/.test(ligne)) continue;
    const morceaux = cellules(ligne);
    // Sans colonne repérable, on lit les « fichier.py:ligne » de toute la ligne.
    const source = colonne >= 0 ? morceaux[colonne] || '' : (ligne.match(/\.py\s*:\s*[\d\s,\-à]+/g) || []).join(' ');
    // Une citation d'un fichier de données (brief.json:5, import.csv:3) ne désigne pas une ligne du script audité.
    const sansDonnees = source.replace(/[\w./-]+\.(?:json|csv)\s*:\s*\d+(?:\s*(?:-|à)\s*\d+)?/g, '');
    for (const [debut, fin] of emplacements(sansDonnees)) vues.set(debut + '-' + fin, [debut, fin]);
  }
  return [...vues.values()];
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
  if (process.env.AUDIT_CLE) return process.env.AUDIT_CLE;
  if (!process.stdin.isTTY) {
    console.log(
      'Clé du formateur nécessaire : lancez npm run verifier-audit vous-même, dans le terminal, ' +
        'et saisissez la clé que donne le formateur.',
    );
    process.exit(1);
  }
  return saisirMasque('Clé du formateur (rien ne s’affiche pendant la frappe), puis Entrée : ');
}

function dechiffrer(cleSaisie) {
  const { N, r, p } = attendus.derivation;
  const cle = crypto.scryptSync(cleSaisie.trim().toLowerCase(), Buffer.from(attendus.sel, 'base64'), 32, {
    N,
    r,
    p,
    maxmem: 64 * 1024 * 1024,
  });
  const dechiffreur = crypto.createDecipheriv('aes-256-gcm', cle, Buffer.from(attendus.iv, 'base64'));
  dechiffreur.setAuthTag(Buffer.from(attendus.etiquette, 'base64'));
  try {
    const clair = Buffer.concat([dechiffreur.update(Buffer.from(attendus.donnees, 'base64')), dechiffreur.final()]);
    return JSON.parse(clair.toString('utf8'));
  } catch {
    return null;
  }
}

async function mesurer() {
  const chemin = path.join(dossierExercice, 'AUDIT.md');
  const cites = fs.existsSync(chemin) ? citations(fs.readFileSync(chemin, 'utf8')) : [];
  if (cites.length === 0) {
    console.log(
      'Aucune ligne citée dans le tableau de AUDIT.md. Copiez toute la réponse de l’auditeur ' +
        '(Copilot : Copier ; Codex et Claude Code : /copy), collez-la dans AUDIT.md (Ctrl + A, puis Ctrl + V), ' +
        'enregistrez, puis relancez npm run verifier-audit.',
    );
    process.exitCode = 1;
    return;
  }

  const failles = dechiffrer(await demanderCle());
  if (!failles) {
    console.log(
      'Clé incorrecte : les emplacements attendus ne s’ouvrent pas. ' +
        'Vérifiez la clé donnée par le formateur, puis relancez npm run verifier-audit.',
    );
    process.exitCode = 1;
    return;
  }

  const dans = (ligne, faille) => faille.plages.some(([a, b]) => ligne >= a && ligne <= b);
  const localisees = new Set();
  let horsFaille = 0;
  for (const [debut, fin] of cites) {
    if (fin - debut + 1 > PLAGE_MAX) {
      horsFaille++;
      continue;
    }
    let touche = false;
    for (let ligne = debut; ligne <= fin; ligne++) {
      failles.forEach((faille, i) => {
        if (dans(ligne, faille)) {
          localisees.add(i);
          touche = true;
        }
      });
    }
    if (!touche) horsFaille++;
  }

  console.log(
    'Audit : ' + localisees.size + ' ' + (localisees.size > 1 ? 'failles localisées' : 'faille localisée') +
      ' sur ' + failles.length + ' ; ' + pluriel(horsFaille, 'ligne') + ' ' +
      (horsFaille > 1 ? 'citées ne correspondent' : 'citée ne correspond') + ' à aucune faille.',
  );
  failles.forEach((faille, i) => {
    if (!localisees.has(i)) console.log('- Manquée : ' + faille.famille + '.');
  });
}

mesurer();
