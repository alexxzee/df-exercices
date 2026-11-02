'use strict';

// Données de démonstration, fictives. Chaque appel rend une copie neuve.
// Un devis : { id, clientId, date (AAAA-MM-JJ), totalHT, totalTTC }.

const CLIENTS = [
  { id: 1, nom: 'Bâti Rhône SARL', ville: 'Lyon', grandCompte: true },
  { id: 2, nom: 'Menuiserie Garnier', ville: 'Villeurbanne', grandCompte: false },
  { id: 3, nom: 'Isol’Est Rénovation', ville: 'Bron', grandCompte: false },
  { id: 4, nom: 'Carrelages du Val', ville: 'Vienne', grandCompte: false },
  { id: 5, nom: 'Couvertures Faure', ville: 'Givors', grandCompte: false },
  { id: 6, nom: 'Plâtrerie Moulin', ville: 'Écully', grandCompte: false },
  { id: 7, nom: 'Habitat Concept 69', ville: 'Caluire', grandCompte: true },
  { id: 8, nom: 'Électricité Perret', ville: 'Oullins', grandCompte: false },
];

const DEVIS = [
  { id: 1, clientId: 2, date: '2026-10-05', totalHT: 412.5, totalTTC: 495 },
  { id: 2, clientId: 1, date: '2026-10-05', totalHT: 3180, totalTTC: 3816 },
  { id: 3, clientId: 4, date: '2026-10-06', totalHT: 96.4, totalTTC: 115.68 },
  { id: 4, clientId: 7, date: '2026-10-08', totalHT: 1250, totalTTC: 1500 },
  { id: 5, clientId: 3, date: '2026-10-08', totalHT: 640.25, totalTTC: 768.3 },
  { id: 6, clientId: 5, date: '2026-10-09', totalHT: 75, totalTTC: 90 },
  { id: 7, clientId: 6, date: '2026-10-12', totalHT: 2045.8, totalTTC: 2454.96 },
  { id: 8, clientId: 8, date: '2026-10-12', totalHT: 318, totalTTC: 381.6 },
];

function creerDonnees() {
  return {
    clients: CLIENTS.map((client) => ({ ...client })),
    devis: DEVIS.map((devis) => ({ ...devis })),
  };
}

function trouverClient(donnees, id) {
  return donnees.clients.find((client) => client.id === id) || null;
}

module.exports = { creerDonnees, trouverClient };
