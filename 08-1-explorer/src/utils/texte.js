'use strict';

// Comparaison des saisies sans tenir compte des accents ni de la casse.
function normaliser(texte) {
  return texte
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

function contient(texte, recherche) {
  return normaliser(texte).includes(normaliser(recherche));
}

module.exports = { normaliser, contient };
