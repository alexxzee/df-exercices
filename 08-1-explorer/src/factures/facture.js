'use strict';

const { totalCommande } = require('../commandes/total');
const { numeroFacture } = require('./numerotation');
const { dateEcheance } = require('./echeances');

function genererFacture(commande, dateFacture, rang) {
  return {
    numero: numeroFacture(dateFacture, rang),
    commande: commande.numero,
    client: commande.client.id,
    date: dateFacture,
    echeance: dateEcheance(dateFacture),
    ...totalCommande(commande),
  };
}

module.exports = { genererFacture };
