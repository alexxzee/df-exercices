'use strict';

// Frais de petite commande affichés sur l'estimation du devis (règle 2024) :
// 9,00 € HT sous 100,00 € HT de marchandises, pour tous les clients.
const SEUIL_PETITE_COMMANDE_HT = 100;
const FRAIS_PETITE_COMMANDE_HT = 9;

function fraisPetiteCommandeHT(marchandisesHT) {
  return marchandisesHT < SEUIL_PETITE_COMMANDE_HT ? FRAIS_PETITE_COMMANDE_HT : 0;
}

module.exports = { SEUIL_PETITE_COMMANDE_HT, FRAIS_PETITE_COMMANDE_HT, fraisPetiteCommandeHT };
