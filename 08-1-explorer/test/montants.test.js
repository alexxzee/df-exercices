'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { arrondir, sommeLignesHT, formaterEuros } = require('../src/utils/montants');

test('arrondit au centime', () => {
  assert.equal(arrondir(1.005), 1.01);
  assert.equal(arrondir(2.344), 2.34);
});

test('additionne les lignes', () => {
  assert.equal(sommeLignesHT([{ quantite: 3, prixUnitaireHT: 8.9 }, { quantite: 2, prixUnitaireHT: 12.4 }]), 51.5);
});

test('formate en euros', () => {
  assert.equal(formaterEuros(1234.5), '1234,50 €');
});
