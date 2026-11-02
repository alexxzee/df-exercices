'use strict';

// Paliers de remise par quantité des conditions commerciales, du plus haut au plus bas.
const PALIERS = [
  { seuil: 100, taux: 0.15 },
  { seuil: 50, taux: 0.1 },
  { seuil: 10, taux: 0.05 },
];

function tauxRemiseQuantite(quantite) {
  for (const palier of PALIERS) {
    if (quantite > palier.seuil) return palier.taux;
  }
  return 0;
}

function arrondirCentime(montant) {
  return Math.round(montant * 100) / 100;
}

function montantLigne(quantite, prixUnitaireHT) {
  const brut = quantite * prixUnitaireHT;
  return arrondirCentime(brut * (1 - tauxRemiseQuantite(quantite)));
}

module.exports = { tauxRemiseQuantite, montantLigne };
