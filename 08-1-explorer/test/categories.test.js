'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { estGrandCompte, estProfessionnel } = require('../src/clients/categories');
const { trouverClient } = require('../src/clients/repertoire');

test('reconnaît un grand compte', () => {
  assert.equal(estGrandCompte(trouverClient('C-1002')), true);
  assert.equal(estGrandCompte(trouverClient('C-1001')), false);
});

test('un particulier n’est pas professionnel', () => {
  assert.equal(estProfessionnel(trouverClient('C-1003')), false);
});

test('refuse un client inconnu', () => {
  assert.throws(() => trouverClient('C-9999'), /Client inconnu/);
});
