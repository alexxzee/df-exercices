'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { estimationDevis } = require('../src/devis/estimation');

test('estimation d’un devis sans frais', () => {
  const devis = { lignes: [{ reference: 'COLLE-PU', quantite: 10, prixUnitaireHT: 12.4 }] };
  assert.equal(estimationDevis(devis).totalHT, 124);
});

test('estimation d’un devis avec frais', () => {
  const devis = { lignes: [{ reference: 'VIS-4X40', quantite: 5, prixUnitaireHT: 8.9 }] };
  const estimation = estimationDevis(devis);
  assert.equal(estimation.fraisHT, 9);
  assert.equal(estimation.totalHT, 53.5);
});
