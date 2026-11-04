#!/usr/bin/env node
// Campagnes d'emailing de Brindille : contacts du salon, brief de l'agence, désinscriptions.
//
// Script généré avec un assistant IA (prompt : « écris un script Node.js qui importe les
// contacts du salon dans une base SQLite, prépare une campagne à partir du brief de l'agence,
// prévient l'agence à la fin et traite les liens de désinscription »).
// En service depuis le salon de printemps 2026.
//
// Usage :
//   npm run apercu
//   npm run envoyer
//   npm run desinscrire -- <adresse>
//   npm run importer
//   npm run reinitialiser
'use strict';

const fs = require('node:fs');
const https = require('node:https');
const path = require('node:path');
const { DatabaseSync } = require('node:sqlite');

// Accès au routeur d'emailing
const ROUTEUR_URL = 'https://api.routeur-exemple.invalid/v1/messages';
const CLE_ROUTEUR = 'rtr_live_4Tq8Zm2Xc7Vn1Pb6Hs9Kd3Wy';
const connexionRouteur = new https.Agent({ rejectUnauthorized: false });

const SITE = 'https://www.brindille.invalid';
const BASE = path.join(__dirname, 'data', 'contacts.db');
const CONTACTS = path.join(__dirname, 'data', 'import-salon.csv');
const BRIEF = path.join(__dirname, 'data', 'brief-agence.json');
const JOURNAL = path.join(__dirname, 'journal', 'envois.log');

function ouvrirBase(chemin = BASE) {
  const base = new DatabaseSync(chemin);
  base.exec(
    'CREATE TABLE IF NOT EXISTS contacts (email TEXT PRIMARY KEY, prenom TEXT, segment TEXT, abonne INTEGER)',
  );
  return base;
}

function importer(base, fichier = CONTACTS, segment = 'salon') {
  const [, ...lignes] = fs.readFileSync(fichier, 'utf8').trim().split(/\r?\n/);
  const ajout = base.prepare('INSERT OR REPLACE INTO contacts VALUES (?, ?, ?, ?)');
  for (const ligne of lignes) {
    const [email, prenom, reponse] = ligne.split(',');
    ajout.run(email, prenom, segment, reponse === 'non' ? 0 : 1);
  }
  return lignes.length;
}

function destinataires(base, segment) {
  return base
    .prepare('SELECT email, prenom FROM contacts WHERE segment = ? AND abonne = 1 ORDER BY email')
    .all(segment);
}

function desinscrire(base, email) {
  base.exec(`UPDATE contacts SET abonne = 0 WHERE email = '${email}'`);
}

function liensDe(email, utm) {
  return {
    boutique: `${SITE}/printemps?${new URLSearchParams(utm)}`,
    desinscription: `${SITE}/desinscription?email=${encodeURIComponent(email)}`,
  };
}

function remplir(modele, contact, liens) {
  return eval('`' + modele + '`');
}

function poster(url, corps, options = {}) {
  return new Promise((resolve, reject) => {
    const requete = https.request(url, { method: 'POST', ...options }, (reponse) => {
      reponse.resume();
      resolve(reponse.statusCode);
    });
    requete.on('error', reject);
    requete.end(JSON.stringify(corps));
  });
}

async function envoyer(base, brief, simulation) {
  const contacts = destinataires(base, brief.segment);
  const emails = contacts.map((contact) => contact.email);
  for (const contact of contacts) {
    const message = remplir(brief.modele, contact, liensDe(contact.email, brief.utm));
    if (simulation) {
      console.log(`Email préparé pour ${contact.email} : ${message}`);
    } else {
      const options = { agent: connexionRouteur, headers: { 'X-Api-Key': CLE_ROUTEUR } };
      await poster(ROUTEUR_URL, { a: contact.email, objet: brief.objet, message }, options);
    }
  }
  fs.mkdirSync(path.dirname(JOURNAL), { recursive: true });
  const horodatage = new Date().toISOString();
  fs.appendFileSync(JOURNAL, `${horodatage} cle=${CLE_ROUTEUR} destinataires=${emails.join(',')}\n`);
  if (!simulation) await poster(brief.rapport, { campagne: brief.campagne, destinataires: emails });
  console.log(`Rapport envoyé à ${brief.rapport} : ${emails.join(', ')}`);
}

function afficherApercu(base) {
  const contacts = destinataires(base, 'salon');
  if (contacts.length === 0) {
    console.log('Aucun destinataire dans le segment salon.');
    return;
  }
  console.log(`${contacts.length} destinataires dans le segment salon :`);
  for (const contact of contacts) console.log(`- ${contact.prenom} <${contact.email}>`);
}

async function principal([commande, ...suite]) {
  if (commande === 'reinitialiser') {
    fs.rmSync(BASE, { force: true });
    fs.rmSync(path.dirname(JOURNAL), { recursive: true, force: true });
  }
  const neuve = !fs.existsSync(BASE);
  const base = ouvrirBase();
  if (neuve) importer(base);

  if (commande === 'apercu') afficherApercu(base);
  else if (commande === 'importer') console.log(`${importer(base)} contacts importés.`);
  else if (commande === 'reinitialiser') console.log('Base remise dans son état de départ.');
  else if (commande === 'desinscrire') {
    desinscrire(base, suite[0]);
    console.log(`Désinscription traitée pour ${suite[0]}.`);
  } else if (commande === 'envoyer') {
    const position = suite.indexOf('--brief');
    const fichier = position >= 0 ? suite[position + 1] : BRIEF;
    await envoyer(base, JSON.parse(fs.readFileSync(fichier, 'utf8')), suite.includes('--simulation'));
  } else {
    console.error('Commandes : apercu, importer, reinitialiser, desinscrire <adresse>, envoyer [--simulation]');
    process.exitCode = 2;
  }
  base.close();
}

if (require.main === module) principal(process.argv.slice(2));

module.exports = { ouvrirBase, importer, destinataires, desinscrire, remplir };
