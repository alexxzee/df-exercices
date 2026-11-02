'use strict';

const { PRODUITS } = require('./produits');
const { contient } = require('../utils/texte');

function rechercherProduits(texte) {
  return PRODUITS.filter((produit) => contient(produit.libelle, texte) || contient(produit.reference, texte));
}

module.exports = { rechercherProduits };
