'use strict';

const { quantiteDisponible } = require('./disponibilite');

// Réserve le stock d'une commande confirmée ; rien n'est réservé si une ligne manque.
function reserver(lignes, reservees = {}) {
  const resultat = { ...reservees };
  for (const ligne of lignes) {
    const deja = resultat[ligne.reference] || 0;
    if (deja + ligne.quantite > quantiteDisponible(ligne.reference)) return null;
    resultat[ligne.reference] = deja + ligne.quantite;
  }
  return resultat;
}

module.exports = { reserver };
