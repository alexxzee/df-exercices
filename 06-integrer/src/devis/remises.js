'use strict';

// Remises d'un devis D&F Commandes, selon docs/regles-remises.md.

const PALIERS = [
  { seuil: 100, taux: 0.12 },
  { seuil: 50, taux: 0.08 },
  { seuil: 10, taux: 0.05 },
];
const TAUX_GRAND_COMPTE = 0.05;
const PLAFOND_REMISES = 0.15;

function arrondir(montant) {
  return Math.round(montant * 100) / 100;
}

function tauxQuantite(quantite) {
  for (const palier of PALIERS) {
    if (quantite >= palier.seuil) return palier.taux;
  }
  return 0;
}

// lignes : [{ quantite, prixUnitaireHT }] ; grandCompte : booléen.
function remisesDevis(lignes, grandCompte) {
  let brut = 0;
  let remiseQuantite = 0;
  for (const ligne of lignes) {
    const montant = ligne.quantite * ligne.prixUnitaireHT;
    brut += montant;
    remiseQuantite += montant * tauxQuantite(ligne.quantite);
  }
  let remiseGrandCompte = grandCompte ? (brut - remiseQuantite) * TAUX_GRAND_COMPTE : 0;
  const plafond = brut * PLAFOND_REMISES;
  if (remiseQuantite + remiseGrandCompte > plafond) {
    remiseGrandCompte = Math.max(0, plafond - remiseQuantite);
  }
  const remise = remiseQuantite + remiseGrandCompte;
  return { brut: arrondir(brut), remise: arrondir(remise), totalHT: arrondir(brut - remise) };
}

module.exports = { arrondir, tauxQuantite, remisesDevis, PLAFOND_REMISES };
