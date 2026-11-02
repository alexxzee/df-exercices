'use strict';

const { STOCK } = require('./disponibilite');

// Seuil d'alerte par référence : en dessous, l'acheteur reçoit une proposition de commande fournisseur.
const SEUILS_ALERTE = { 'VIS-4X40': 100, 'PLAQ-BA13': 40, 'LAINE-R5': 20, 'COLLE-PU': 10, 'PERC-18V': 5, 'LED-12W': 60 };

function referencesAReapprovisionner() {
  return Object.keys(SEUILS_ALERTE).filter((reference) => (STOCK[reference] || 0) < SEUILS_ALERTE[reference]);
}

module.exports = { SEUILS_ALERTE, referencesAReapprovisionner };
