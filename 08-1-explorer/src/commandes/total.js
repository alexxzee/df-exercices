'use strict';

const { TAUX_TVA, arrondir, sommeLignesHT } = require('../utils/montants');
const { ecoParticipationHT } = require('./frais');

// Total facturé d'une commande : la facture reprend ces montants tels quels.
function totalCommande(commande) {
  const marchandisesHT = sommeLignesHT(commande.lignes);
  const ecoHT = ecoParticipationHT(commande.lignes);
  const totalHT = arrondir(marchandisesHT + ecoHT);
  const tva = arrondir(totalHT * TAUX_TVA);
  return { marchandisesHT, ecoParticipationHT: ecoHT, totalHT, tva, totalTTC: arrondir(totalHT + tva) };
}

module.exports = { totalCommande };
