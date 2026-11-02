'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { creerApp } = require('../src/app');
const { creerDonnees } = require('../src/donnees');

test('une route inconnue rend 404 en JSON', () => {
  const reponse = creerApp(creerDonnees()).traiter({ methode: 'GET', chemin: '/inconnue' });
  assert.equal(reponse.statut, 404);
  assert.equal(reponse.type, 'application/json; charset=utf-8');
});
