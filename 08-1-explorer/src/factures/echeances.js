'use strict';

const { ajouterJours, finDeMois } = require('../utils/dates');

// Paiement à 30 jours fin de mois à compter de la date de facture.
function dateEcheance(dateFacture) {
  return finDeMois(ajouterJours(dateFacture, 30));
}

module.exports = { dateEcheance };
