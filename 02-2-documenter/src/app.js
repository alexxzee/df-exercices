// Fichier de la formation : ne pas modifier.
'use strict';

const http = require('node:http');
const { calculerDevis } = require('./devis/calcul');
const config = require('./config');

function envoyer(reponse, statut, corps) {
  reponse.writeHead(statut, { 'Content-Type': 'application/json; charset=utf-8' });
  reponse.end(JSON.stringify(corps));
}

function lireCorps(requete) {
  return new Promise((resoudre, rejeter) => {
    let corps = '';
    requete.on('data', (morceau) => { corps += morceau; });
    requete.on('end', () => resoudre(corps));
    requete.on('error', rejeter);
  });
}

function creerServeur() {
  return http.createServer(async (requete, reponse) => {
    if (config.journal) console.log(`${requete.method} ${requete.url}`);
    if (requete.method === 'GET' && requete.url === '/sante') {
      return envoyer(reponse, 200, { statut: 'ok' });
    }
    if (requete.method === 'POST' && requete.url === '/devis') {
      try {
        const { client, lignes } = JSON.parse(await lireCorps(requete));
        return envoyer(reponse, 200, calculerDevis(client || {}, lignes));
      } catch (erreur) {
        return envoyer(reponse, 400, { erreur: erreur.message });
      }
    }
    return envoyer(reponse, 404, { erreur: 'Route inconnue' });
  });
}

if (require.main === module) {
  creerServeur().listen(config.port, () => {
    console.log(`Calcul des devis : http://localhost:${config.port}`);
  });
}

module.exports = { creerServeur };
