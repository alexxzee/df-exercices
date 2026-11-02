'use strict';

const { ajouterJoursOuvres } = require('../utils/dates');

// Livraison sur chantier : deux jours ouvrés après la confirmation, le matin ou l'après-midi.
const CRENEAUX = ['08:00-12:00', '13:30-17:30'];

function premierJourDeLivraison(dateConfirmation) {
  return ajouterJoursOuvres(dateConfirmation, 2);
}

module.exports = { CRENEAUX, premierJourDeLivraison };
