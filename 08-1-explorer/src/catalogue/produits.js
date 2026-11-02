'use strict';

// Extrait du catalogue de démonstration. Prix et écoparticipation en euros HT.
const PRODUITS = [
  { reference: 'VIS-4X40', libelle: 'Vis bois 4 x 40, boîte de 200', prixHT: 8.9, ecoParticipationHT: 0 },
  { reference: 'PLAQ-BA13', libelle: 'Plaque de plâtre BA13, 250 x 120', prixHT: 7.85, ecoParticipationHT: 0 },
  { reference: 'LAINE-R5', libelle: 'Laine de verre R5, rouleau', prixHT: 38.64, ecoParticipationHT: 0 },
  { reference: 'COLLE-PU', libelle: 'Colle polyuréthane, 750 g', prixHT: 12.4, ecoParticipationHT: 0 },
  { reference: 'PERC-18V', libelle: 'Perceuse sans fil 18 V', prixHT: 129, ecoParticipationHT: 0.5 },
  { reference: 'LED-12W', libelle: 'Ampoule LED 12 W, culot E27', prixHT: 6.9, ecoParticipationHT: 0.1 },
];

function trouverProduit(reference) {
  const produit = PRODUITS.find((candidat) => candidat.reference === reference);
  if (!produit) throw new Error('Référence inconnue : ' + reference);
  return produit;
}

module.exports = { PRODUITS, trouverProduit };
