'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { validerLignes } = require('../src/commandes/validation');

test('refuse une commande sans ligne', () => {
  assert.throws(() => validerLignes([]), /au moins une ligne/);
});

test('refuse une quantité nulle', () => {
  assert.throws(() => validerLignes([{ reference: 'VIS-4X40', quantite: 0, prixUnitaireHT: 8.9 }]), /Quantité invalide/);
});
