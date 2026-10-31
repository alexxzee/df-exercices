// Ne pas toucher, l'entrepôt imprime ça tous les matins (JM, 2021)
'use strict';

function editerBonPreparation(commande, catalogue, stocks, aujourdHui) {
  var texte = '';

  if (commande.urgente == true) {
    texte = texte + '*** URGENT ***\n';
  }
  texte = texte + 'BON DE PRÉPARATION N° ' + commande.numero + '\n';

  var client = 'Client : ' + commande.client;
  while (client.length < 40) {
    client = client + ' ';
  }
  var p = commande.dateLimite.split('-');
  texte = texte + client + 'Préparer avant : ' + p[2] + '/' + p[1] + '/' + p[0] + '\n';

  var d = aujourdHui;
  if (d == undefined) {
    d = new Date();
  }
  var jour = d.getDate();
  if (jour < 10) {
    jour = '0' + jour;
  }
  var mois = d.getMonth() + 1;
  if (mois < 10) {
    mois = '0' + mois;
  }
  texte = texte + 'Édité le : ' + jour + '/' + mois + '/' + d.getFullYear() + '\n';
  texte = texte + '\n';

  // on récupère les lignes avec leur article
  var lignes = [];
  for (var i = 0; i < commande.lignes.length; i++) {
    if (commande.lignes[i].quantite == 0) continue;
    var article = null;
    for (var j = 0; j < catalogue.length; j++) {
      if (catalogue[j].ref == commande.lignes[i].ref) {
        article = catalogue[j];
      }
    }
    lignes.push({ ref: commande.lignes[i].ref, quantite: commande.lignes[i].quantite, article: article });
  }

  // tri par allée puis emplacement, ceux sans allée à la fin
  for (var a = 0; a < lignes.length; a++) {
    for (var b = 0; b < lignes.length - 1; b++) {
      var x = lignes[b];
      var y = lignes[b + 1];
      var cleX = x.article == null || !x.article.allee ? 'ZZZ' : x.article.allee + '-' + x.article.emplacement;
      var cleY = y.article == null || !y.article.allee ? 'ZZZ' : y.article.allee + '-' + y.article.emplacement;
      if (cleX > cleY) {
        lignes[b] = y;
        lignes[b + 1] = x;
      }
    }
  }

  var nbLignes = 0;
  var nbArticles = 0;
  for (var k = 0; k < lignes.length; k++) {
    var l = lignes[k];
    if (l.article == null) {
      // référence pas dans le catalogue
      var col1 = ('--' + '          ').substring(0, 6);
      var col2 = (l.ref + '          ').substring(0, 10);
      var col3 = ('?' + '                              ').substring(0, 30);
      var col4 = ('x ' + l.quantite + '      ').substring(0, 6);
      texte = texte + col1 + col2 + col3 + col4 + 'Réf. inconnue' + '\n';
    } else {
      var c1 = '--';
      if (l.article.allee) {
        c1 = l.article.allee + '-' + l.article.emplacement;
      }
      c1 = (c1 + '          ').substring(0, 6);
      var c2 = (l.ref + '          ').substring(0, 10);
      var lib = l.article.libelle;
      if (lib.length > 28) {
        lib = lib.substring(0, 28) + '…';
      }
      var c3 = (lib + '                              ').substring(0, 30);
      var c4 = ('x ' + l.quantite + '      ').substring(0, 6);

      var statut = '';
      var stock = stocks[l.ref];
      if (stock == undefined) {
        statut = 'Rupture';
      } else {
        if (stock >= l.quantite) {
          statut = 'En stock';
        } else {
          statut = 'Partiel (' + stock + '/' + l.quantite + ')';
        }
      }

      var mentions = '';
      if (l.article.fragile == true) {
        mentions = mentions + ' [FRAGILE]';
      }
      if (l.article.poids > 25) {
        mentions = mentions + ' [2 PERS.]';
      }
      texte = texte + c1 + c2 + c3 + c4 + statut + mentions + '\n';
    }
    nbLignes = nbLignes + 1;
    nbArticles = nbArticles + l.quantite;
  }

  texte = texte + '\n';
  texte = texte + 'Lignes : ' + nbLignes + ' | Articles : ' + nbArticles + '\n';
  return texte;
}

module.exports = { editerBonPreparation };
