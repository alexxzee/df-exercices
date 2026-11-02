'use strict';

const { totalCommande } = require('./total');
const { formaterDate } = require('../utils/dates');

// Ligne de l'export comptable du soir : numéro;date;client;total HT;TVA;total TTC.
function ligneExport(commande) {
  const montants = totalCommande(commande);
  return [
    commande.numero,
    formaterDate(commande.date),
    commande.client.id,
    montants.totalHT.toFixed(2),
    montants.tva.toFixed(2),
    montants.totalTTC.toFixed(2),
  ].join(';');
}

module.exports = { ligneExport };
