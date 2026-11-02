'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { rechercherProduits } = require('../src/catalogue/recherche');
const { ligneDepuisCatalogue } = require('../src/catalogue/lignes');

test('cherche sans tenir compte des accents', () => {
  assert.deepEqual(rechercherProduits('platre').map((produit) => produit.reference), ['PLAQ-BA13']);
});

test('chiffre une ligne au prix du catalogue', () => {
  assert.equal(ligneDepuisCatalogue('LAINE-R5', 4).prixUnitaireHT, 38.64);
});
