// Fichier de la formation : ne pas modifier.
'use strict';

const { creerRouteur } = require('./routeur');
const { json } = require('./reponses');
const routesClients = require('./routes/clients');
const routesDevis = require('./routes/devis');

// Construit l'application sur un jeu de données ({ clients, devis }).
// Rend { traiter } : traiter({ methode, chemin }) donne { statut, type, corps }.
function creerApp(donnees) {
  const routeur = creerRouteur();
  routeur.get('/sante', () => json(200, { statut: 'ok' }));
  routesClients(routeur, donnees);
  routesDevis(routeur, donnees);
  return { traiter: routeur.traiter };
}

module.exports = { creerApp };
