'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { changerStatut } = require('../src/commandes/statuts');

test('confirme une commande saisie', () => {
  assert.equal(changerStatut({ statut: 'saisie' }, 'confirmee').statut, 'confirmee');
});

test('refuse de livrer une commande non expédiée', () => {
  assert.throws(() => changerStatut({ statut: 'preparee' }, 'livree'), /Passage impossible/);
});
