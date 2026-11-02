'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { tauxQuantite, remisesDevis } = require('../../src/devis/remises');

test('aucune remise sous 10 unités', () => {
  assert.equal(tauxQuantite(9), 0);
});

test('les seuils sont inclus : 5 % à 10 unités', () => {
  assert.equal(tauxQuantite(10), 0.05);
});

test('12 % à partir de 100 unités', () => {
  assert.equal(tauxQuantite(100), 0.12);
});

test('client ordinaire : seule la remise sur quantité', () => {
  // 20 x 10 € = 200 € brut, 5 % = 10 €.
  assert.deepEqual(remisesDevis([{ quantite: 20, prixUnitaireHT: 10 }], false), {
    brut: 200,
    remise: 10,
    totalHT: 190,
  });
});

test('grand compte sous le plafond : 5 % de plus sur le total remisé', () => {
  // 20 x 10 € = 200 € ; quantité 10 € ; grand compte 5 % de 190 € = 9,50 € ; 19,50 € < 30 €.
  assert.deepEqual(remisesDevis([{ quantite: 20, prixUnitaireHT: 10 }], true), {
    brut: 200,
    remise: 19.5,
    totalHT: 180.5,
  });
});

test('grand compte au-dessus du plafond : remises ramenées à 15 % du brut', () => {
  // 100 x 10 € = 1 000 € ; quantité 120 € ; grand compte 44 € ; 164 € > 150 € : plafonné à 150 €.
  assert.deepEqual(remisesDevis([{ quantite: 100, prixUnitaireHT: 10 }], true), {
    brut: 1000,
    remise: 150,
    totalHT: 850,
  });
});
