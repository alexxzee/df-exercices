'use strict';

// Stock de démonstration, en unités de vente.
const STOCK = { 'VIS-4X40': 420, 'PLAQ-BA13': 96, 'LAINE-R5': 18, 'COLLE-PU': 0, 'PERC-18V': 7, 'LED-12W': 240 };

function quantiteDisponible(reference) {
  return STOCK[reference] || 0;
}

function lignesEnRupture(lignes) {
  return lignes.filter((ligne) => ligne.quantite > quantiteDisponible(ligne.reference));
}

module.exports = { STOCK, quantiteDisponible, lignesEnRupture };
