'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { genererFacture } = require('../src/factures/facture');
const { penaliteRetard } = require('../src/factures/penalites');
const { trouverClient } = require('../src/clients/repertoire');

test('la facture reprend le total de la commande', () => {
  const commande = {
    numero: 'CMD-2026-00042',
    client: trouverClient('C-1001'),
    lignes: [{ reference: 'LAINE-R5', quantite: 4, prixUnitaireHT: 38.64 }],
  };
  const facture = genererFacture(commande, new Date('2026-10-15T00:00:00Z'), 7);
  assert.equal(facture.numero, 'FAC-2026-00007');
  assert.equal(facture.totalHT, 154.56);
  assert.equal(facture.echeance.toISOString().slice(0, 10), '2026-11-30');
});

test('pénalité de retard', () => {
  assert.equal(penaliteRetard(1200, 0), 0);
  assert.equal(penaliteRetard(1200, 30), 49.86);
});
