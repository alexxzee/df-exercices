'use strict';

function validerLignes(lignes) {
  if (!Array.isArray(lignes) || lignes.length === 0) {
    throw new Error('Une commande comporte au moins une ligne.');
  }
  for (const ligne of lignes) {
    if (!Number.isInteger(ligne.quantite) || ligne.quantite <= 0) {
      throw new Error('Quantité invalide pour ' + ligne.reference + ' : ' + ligne.quantite);
    }
    if (typeof ligne.prixUnitaireHT !== 'number' || ligne.prixUnitaireHT < 0) {
      throw new Error('Prix invalide pour ' + ligne.reference);
    }
  }
}

module.exports = { validerLignes };
