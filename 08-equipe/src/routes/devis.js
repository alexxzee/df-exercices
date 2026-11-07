'use strict';

const { json } = require('../reponses');

module.exports = function routesDevis(routeur, donnees) {
  // Liste des devis, filtrée par client si ?client=<id> est donné.
  routeur.get('/devis', (requete) => {
    const client = requete.query.client ? Number(requete.query.client) : null;
    const liste = client === null ? donnees.devis : donnees.devis.filter((devis) => devis.clientId === client);
    return json(200, liste);
  });

  routeur.get('/devis/:id', (requete) => {
    const devis = donnees.devis.find((d) => d.id === Number(requete.params.id));
    if (!devis) return json(404, { erreur: 'Devis introuvable' });
    return json(200, devis);
  });
};
