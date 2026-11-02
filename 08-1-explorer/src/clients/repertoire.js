'use strict';

const { CATEGORIES } = require('./categories');

// Clients de démonstration : noms et adresses fictifs.
const CLIENTS = [
  { id: 'C-1001', nom: 'Menuiserie des Tilleuls', categorie: CATEGORIES.PROFESSIONNEL, ville: 'Vienne' },
  { id: 'C-1002', nom: 'Groupe Bâti-Rhône', categorie: CATEGORIES.GRAND_COMPTE, ville: 'Lyon' },
  { id: 'C-1003', nom: 'Client comptoir', categorie: CATEGORIES.PARTICULIER, ville: 'Givors' },
  { id: 'C-1004', nom: 'Rénov’Alpes', categorie: CATEGORIES.PROFESSIONNEL, ville: 'Grenoble' },
  { id: 'C-1005', nom: 'Habitat Confluence', categorie: CATEGORIES.GRAND_COMPTE, ville: 'Lyon' },
];

function trouverClient(id) {
  const client = CLIENTS.find((candidat) => candidat.id === id);
  if (!client) throw new Error('Client inconnu : ' + id);
  return client;
}

module.exports = { CLIENTS, trouverClient };
