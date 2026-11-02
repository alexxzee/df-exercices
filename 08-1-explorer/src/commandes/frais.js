'use strict';

const { arrondir } = require('../utils/montants');

// Écoparticipation : montant unitaire fixé par produit (équipements électriques),
// reversé à l'éco-organisme. Elle figure sur une ligne distincte de la commande.
function ecoParticipationHT(lignes) {
  return arrondir(lignes.reduce((somme, ligne) => somme + ligne.quantite * (ligne.ecoParticipationHT || 0), 0));
}

module.exports = { ecoParticipationHT };
