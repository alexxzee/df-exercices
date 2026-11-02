'use strict';

const JOUR_MS = 24 * 60 * 60 * 1000;

function ajouterJours(date, jours) {
  return new Date(date.getTime() + jours * JOUR_MS);
}

function estJourOuvre(date) {
  const jour = date.getUTCDay();
  return jour !== 0 && jour !== 6;
}

function ajouterJoursOuvres(date, jours) {
  let resultat = date;
  let restants = jours;
  while (restants > 0) {
    resultat = ajouterJours(resultat, 1);
    if (estJourOuvre(resultat)) restants -= 1;
  }
  return resultat;
}

function finDeMois(date) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0));
}

function formaterDate(date) {
  return date.toISOString().slice(0, 10);
}

module.exports = { ajouterJours, estJourOuvre, ajouterJoursOuvres, finDeMois, formaterDate };
