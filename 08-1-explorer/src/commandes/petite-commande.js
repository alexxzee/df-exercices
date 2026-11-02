'use strict';

// Frais de petite commande : 9,00 € HT sous 100,00 € HT de marchandises.
const SEUIL_PETITE_COMMANDE_HT = 100;
const FRAIS_PETITE_COMMANDE_HT = 9;

function fraisPetiteCommande(marchandisesHT) {
  return marchandisesHT < SEUIL_PETITE_COMMANDE_HT ? FRAIS_PETITE_COMMANDE_HT : 0;
}

module.exports = { SEUIL_PETITE_COMMANDE_HT, FRAIS_PETITE_COMMANDE_HT, fraisPetiteCommande };
