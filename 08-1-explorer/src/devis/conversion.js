'use strict';

const { estValide } = require('./validite');
const { creerCommande } = require('../commandes/creation');

// Un devis accepté devient une commande : mêmes lignes, mêmes prix unitaires.
function convertirEnCommande(devis, aujourdhui, rang) {
  if (!estValide(devis, aujourdhui)) {
    throw new Error('Devis expiré : ' + devis.numero);
  }
  return creerCommande(devis.client, devis.lignes, aujourdhui, rang);
}

module.exports = { convertirEnCommande };
