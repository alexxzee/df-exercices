'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { creerCommande } = require('../src/commandes/creation');
const { trouverClient } = require('../src/clients/repertoire');

test('numérote et chiffre la commande', () => {
  const lignes = [{ reference: 'VIS-4X40', quantite: 30, prixUnitaireHT: 8.9 }];
  const commande = creerCommande(trouverClient('C-1004'), lignes, new Date('2026-10-12T00:00:00Z'), 42);
  assert.equal(commande.numero, 'CMD-2026-00042');
  assert.equal(commande.statut, 'saisie');
  assert.equal(commande.montants.totalHT, 267);
});
