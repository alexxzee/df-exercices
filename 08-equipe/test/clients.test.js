'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { creerApp } = require('../src/app');
const { creerDonnees } = require('../src/donnees');

function appeler(chemin) {
  return creerApp(creerDonnees()).traiter({ methode: 'GET', chemin });
}

test('GET /clients/:id rend le client demandé', () => {
  const reponse = appeler('/clients/3');
  assert.equal(reponse.statut, 200);
  assert.equal(JSON.parse(reponse.corps).ville, 'Bron');
});

test('GET /clients/:id rend 404 pour un client inconnu', () => {
  assert.equal(appeler('/clients/42').statut, 404);
});

test('GET /sante répond ok', () => {
  assert.deepEqual(JSON.parse(appeler('/sante').corps), { statut: 'ok' });
});
