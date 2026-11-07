'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { creerApp } = require('../src/app');
const { creerDonnees } = require('../src/donnees');

function appeler(chemin) {
  const reponse = creerApp(creerDonnees()).traiter({ methode: 'GET', chemin });
  return { ...reponse, objet: JSON.parse(reponse.corps) };
}

test('GET /devis rend tous les devis', () => {
  const reponse = appeler('/devis');
  assert.equal(reponse.statut, 200);
  assert.equal(reponse.objet.length, 8);
});

test('GET /devis?client=7 rend les seuls devis du client 7', () => {
  const reponse = appeler('/devis?client=7');
  assert.deepEqual(
    reponse.objet.map((devis) => devis.id),
    [4],
  );
});

test('GET /devis/:id rend le devis demandé', () => {
  const reponse = appeler('/devis/5');
  assert.equal(reponse.statut, 200);
  assert.equal(reponse.objet.totalTTC, 768.3);
});

test('GET /devis/:id rend 404 pour un devis inconnu', () => {
  const reponse = appeler('/devis/99');
  assert.equal(reponse.statut, 404);
  assert.deepEqual(reponse.objet, { erreur: 'Devis introuvable' });
});
