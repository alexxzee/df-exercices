'use strict';

// Catégorie fixée par le service commercial à l'ouverture du compte client.
const CATEGORIES = Object.freeze({
  PARTICULIER: 'particulier',
  PROFESSIONNEL: 'professionnel',
  GRAND_COMPTE: 'grand-compte',
});

function estGrandCompte(client) {
  return client.categorie === CATEGORIES.GRAND_COMPTE;
}

function estProfessionnel(client) {
  return client.categorie !== CATEGORIES.PARTICULIER;
}

module.exports = { CATEGORIES, estGrandCompte, estProfessionnel };
