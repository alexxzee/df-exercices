'use strict';

const { TAUX_TVA, arrondir, sommeLignesHT } = require('../utils/montants');
const { fraisPetiteCommandeHT } = require('./frais');

// Estimation imprimée sur le devis envoyé au client.
function estimationDevis(devis) {
  const marchandisesHT = sommeLignesHT(devis.lignes);
  const fraisHT = fraisPetiteCommandeHT(marchandisesHT);
  const totalHT = arrondir(marchandisesHT + fraisHT);
  const tva = arrondir(totalHT * TAUX_TVA);
  return { marchandisesHT, fraisHT, totalHT, tva, totalTTC: arrondir(totalHT + tva) };
}

module.exports = { estimationDevis };
