'use strict';

// Cycle de vie d'une commande, de la saisie à la livraison.
const TRANSITIONS = Object.freeze({
  saisie: ['confirmee', 'annulee'],
  confirmee: ['preparee', 'annulee'],
  preparee: ['expediee'],
  expediee: ['livree'],
  livree: [],
  annulee: [],
});

function peutPasser(statut, suivant) {
  return (TRANSITIONS[statut] || []).includes(suivant);
}

function changerStatut(commande, suivant) {
  if (!peutPasser(commande.statut, suivant)) {
    throw new Error('Passage impossible de ' + commande.statut + ' à ' + suivant);
  }
  return { ...commande, statut: suivant };
}

module.exports = { TRANSITIONS, peutPasser, changerStatut };
