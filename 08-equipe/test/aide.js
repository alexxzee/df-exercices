// Fichier de la formation : ne pas modifier.
'use strict';

const assert = require('node:assert/strict');
const { creerApp } = require('../src/app');
const { creerDonnees } = require('../src/donnees');

function appelerRoute(chemin, donnees = creerDonnees()) {
  const reponse = creerApp(donnees).traiter({ methode: 'GET', chemin });
  const objet = reponse.type.startsWith('application/json') ? JSON.parse(reponse.corps) : null;
  return { ...reponse, objet };
}

function attendreErreur(reponse, statut, message) {
  assert.equal(reponse.statut, statut);
  assert.equal(reponse.type, 'application/json; charset=utf-8');
  assert.deepEqual(JSON.parse(reponse.corps), { erreur: message });
}

module.exports = { appelerRoute, attendreErreur };
