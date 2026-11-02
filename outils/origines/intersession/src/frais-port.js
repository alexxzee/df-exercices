// Frais de port des commandes, repris de l'ancien site (MB, 2020)
'use strict';

function calculerFraisPort(commande) {
  var poids = 0;
  var montant = 0;
  for (var i = 0; i < commande.lignes.length; i++) {
    poids = poids + commande.lignes[i].quantite * commande.lignes[i].poidsKg;
    montant = montant + commande.lignes[i].quantite * commande.lignes[i].prixHT;
  }
  poids = Math.round(poids);

  if (commande.mode == 'retrait') {
    return { poidsKg: poids, fraisHT: 0 };
  }

  var frais;
  if (poids <= 5) {
    frais = 6.9;
  } else if (poids <= 30) {
    frais = 12.5;
  } else if (poids <= 100) {
    frais = 29;
  } else {
    frais = 85;
  }

  if (commande.pays == 'FR') {
    if (commande.codePostal.substring(0, 2) == '20') {
      frais = frais + 15;
    }
  } else if (commande.pays == 'BE' || commande.pays == 'LU') {
    frais = frais * 1.5;
  } else {
    throw new Error('Pays non desservi : ' + commande.pays);
  }

  if (commande.mode == 'express') {
    if (poids > 100) {
      throw new Error('Express impossible au-delà de 100 kg');
    }
    frais = frais + 9.9;
  }

  var seuil = 500;
  if (commande.grandCompte == true) {
    seuil = 300;
  }
  if (montant > seuil && poids <= 100) {
    frais = 0;
  }

  return { poidsKg: poids, fraisHT: Math.round(frais * 100) / 100 };
}

module.exports = { calculerFraisPort };
