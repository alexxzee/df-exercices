'use strict';

const { ajouterJours } = require('../utils/dates');

const DUREE_VALIDITE_JOURS = 30;

function dateFinValidite(devis) {
  return ajouterJours(devis.date, DUREE_VALIDITE_JOURS);
}

function estValide(devis, aujourdhui) {
  return aujourdhui.getTime() <= dateFinValidite(devis).getTime();
}

module.exports = { DUREE_VALIDITE_JOURS, dateFinValidite, estValide };
