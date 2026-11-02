// Fichier de la formation : ne pas modifier.
'use strict';

// Réponses rendues par les routes : { statut, type, corps }.

function json(statut, objet) {
  return { statut, type: 'application/json; charset=utf-8', corps: JSON.stringify(objet) };
}

function html(statut, texte) {
  return { statut, type: 'text/html; charset=utf-8', corps: texte };
}

module.exports = { json, html };
