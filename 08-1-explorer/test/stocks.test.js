'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { lignesEnRupture } = require('../src/stocks/disponibilite');
const { reserver } = require('../src/stocks/reservations');

test('signale une ligne en rupture', () => {
  const lignes = [{ reference: 'COLLE-PU', quantite: 1 }, { reference: 'VIS-4X40', quantite: 10 }];
  assert.deepEqual(lignesEnRupture(lignes).map((ligne) => ligne.reference), ['COLLE-PU']);
});

test('ne réserve rien si une ligne manque', () => {
  assert.equal(reserver([{ reference: 'PERC-18V', quantite: 8 }]), null);
});
