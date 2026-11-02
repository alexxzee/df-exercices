'use strict';

// Choix du transporteur selon le poids total en kilogrammes.
function transporteurPour(poidsKg) {
  if (poidsKg <= 30) return 'messagerie';
  if (poidsKg <= 1000) return 'camion-plateau';
  return 'semi-remorque';
}

module.exports = { transporteurPour };
