'use strict';

const { json } = require('../reponses');
const { trouverClient } = require('../donnees');

module.exports = function routesClients(routeur, donnees) {
  routeur.get('/clients', () => json(200, donnees.clients));

  routeur.get('/clients/:id', (requete) => {
    const client = trouverClient(donnees, Number(requete.params.id));
    if (!client) return json(404, { erreur: 'Client introuvable' });
    return json(200, client);
  });
};
