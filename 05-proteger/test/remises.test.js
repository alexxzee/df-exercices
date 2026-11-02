'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { tauxRemiseQuantite, montantLigne } = require('../src/remises');

test('aucune remise sur une petite quantité', () => {
  assert.equal(tauxRemiseQuantite(4), 0);
});

test('5 % sur une quantité moyenne', () => {
  assert.equal(tauxRemiseQuantite(25), 0.05);
});

test('10 % sur une grosse quantité', () => {
  assert.equal(tauxRemiseQuantite(70), 0.1);
});

test('15 % sur une très grosse quantité', () => {
  assert.equal(tauxRemiseQuantite(300), 0.15);
});

test('montant d’une ligne remisée, arrondi au centime', () => {
  assert.equal(montantLigne(25, 3.33), 79.09);
});

test('montant d’une ligne sans remise', () => {
  assert.equal(montantLigne(3, 12.5), 37.5);
});
