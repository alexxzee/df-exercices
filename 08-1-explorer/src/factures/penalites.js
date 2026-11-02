'use strict';

const { arrondir } = require('../utils/montants');

// Retard de paiement : pénalité au taux annuel de 10 %, au prorata des jours,
// plus l'indemnité forfaitaire pour frais de recouvrement de 40 € par facture.
const TAUX_PENALITE_ANNUEL = 0.1;
const INDEMNITE_RECOUVREMENT = 40;

function penaliteRetard(montantTTC, joursDeRetard) {
  if (joursDeRetard <= 0) return 0;
  return arrondir((montantTTC * TAUX_PENALITE_ANNUEL * joursDeRetard) / 365 + INDEMNITE_RECOUVREMENT);
}

module.exports = { TAUX_PENALITE_ANNUEL, INDEMNITE_RECOUVREMENT, penaliteRetard };
