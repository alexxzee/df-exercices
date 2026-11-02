'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { totalCommande } = require('../src/commandes/total');
const { trouverClient } = require('../src/clients/repertoire');

const professionnel = trouverClient('C-1001');

test('total d’une commande de plaques et de laine', () => {
  const commande = {
    client: professionnel,
    lignes: [
      { reference: 'PLAQ-BA13', quantite: 20, prixUnitaireHT: 7.85 },
      { reference: 'LAINE-R5', quantite: 4, prixUnitaireHT: 38.64 },
    ],
  };
  const montants = totalCommande(commande);
  assert.equal(montants.marchandisesHT, 311.56);
  assert.equal(montants.totalHT, 311.56);
  assert.equal(montants.tva, 62.31);
  assert.equal(montants.totalTTC, 373.87);
});

test('ajoute l’écoparticipation des équipements électriques', () => {
  const commande = {
    client: professionnel,
    lignes: [
      { reference: 'PERC-18V', quantite: 2, prixUnitaireHT: 129, ecoParticipationHT: 0.5 },
      { reference: 'LED-12W', quantite: 10, prixUnitaireHT: 6.9, ecoParticipationHT: 0.1 },
    ],
  };
  const montants = totalCommande(commande);
  assert.equal(montants.ecoParticipationHT, 2);
  assert.equal(montants.totalHT, 329);
});
