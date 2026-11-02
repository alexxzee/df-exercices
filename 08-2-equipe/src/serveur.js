// Fichier de la formation : ne pas modifier.
'use strict';

// Lance l'application sur http://localhost:3000 avec les données de démonstration.
//   npm start

const http = require('node:http');
const { creerApp } = require('./app');
const { creerDonnees } = require('./donnees');

const app = creerApp(creerDonnees());
const port = Number(process.env.PORT) || 3000;

http
  .createServer((req, res) => {
    const reponse = app.traiter({ methode: req.method, chemin: req.url });
    res.writeHead(reponse.statut, { 'Content-Type': reponse.type });
    res.end(reponse.corps);
  })
  .listen(port, () => console.log('D&F Commandes : http://localhost:' + port));
