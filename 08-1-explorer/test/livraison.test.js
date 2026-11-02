'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { transporteurPour } = require('../src/livraison/transporteurs');
const { premierJourDeLivraison } = require('../src/livraison/creneaux');

test('choisit le transporteur selon le poids', () => {
  assert.equal(transporteurPour(12), 'messagerie');
  assert.equal(transporteurPour(1500), 'semi-remorque');
});

test('livre deux jours ouvrés après la confirmation', () => {
  assert.equal(premierJourDeLivraison(new Date('2026-10-16T00:00:00Z')).toISOString().slice(0, 10), '2026-10-20');
});
