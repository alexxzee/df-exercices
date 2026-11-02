'use strict';

const TAUX_TVA = 0.2;

// Arrondi au centime sans erreur de virgule flottante : 1.005 donne 1.01.
function arrondir(montant) {
  return Math.round(Number((montant * 100).toPrecision(15))) / 100;
}

function sommeLignesHT(lignes) {
  return arrondir(lignes.reduce((somme, ligne) => somme + ligne.quantite * ligne.prixUnitaireHT, 0));
}

function formaterEuros(montant) {
  return arrondir(montant).toFixed(2).replace('.', ',') + ' €';
}

module.exports = { TAUX_TVA, arrondir, sommeLignesHT, formaterEuros };
