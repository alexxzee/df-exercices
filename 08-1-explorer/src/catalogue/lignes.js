'use strict';

const { trouverProduit } = require('./produits');

// Transforme une saisie (référence, quantité) en ligne chiffrée au prix du catalogue.
function ligneDepuisCatalogue(reference, quantite) {
  const produit = trouverProduit(reference);
  return {
    reference,
    libelle: produit.libelle,
    quantite,
    prixUnitaireHT: produit.prixHT,
    ecoParticipationHT: produit.ecoParticipationHT,
  };
}

module.exports = { ligneDepuisCatalogue };
