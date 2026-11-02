'use strict';

const { validerLignes } = require('./validation');
const { totalCommande } = require('./total');
const { numeroter } = require('../utils/identifiants');

function creerCommande(client, lignes, date, rang) {
  validerLignes(lignes);
  const commande = {
    numero: numeroter('CMD', date.getUTCFullYear(), rang),
    client,
    lignes,
    date,
    statut: 'saisie',
  };
  return { ...commande, montants: totalCommande(commande) };
}

module.exports = { creerCommande };
