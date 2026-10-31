// Fichier de la formation : ne pas modifier.
// Petites modifications essayées sur le code d'origine de 03-refactoriser.
// Chacune change un comportement ; un bon filet de tests doit passer au rouge.
'use strict';

module.exports = {
  fichier: 'src/bon-preparation.js',
  mutations: [
    {
      comportement: 'l’ordre des lignes',
      chercher: 'if (cleX > cleY) {',
      remplacer: 'if (cleX < cleY) {',
    },
    {
      comportement: 'le format de la date « Préparer avant »',
      chercher: "p[2] + '/' + p[1] + '/' + p[0]",
      remplacer: "p[0] + '-' + p[1] + '-' + p[2]",
    },
    {
      comportement: 'la coupure des libellés trop longs',
      chercher: 'lib = lib.substring(0, 28)',
      remplacer: 'lib = lib.substring(0, 27)',
    },
    {
      comportement: 'l’écriture du statut d’un article disponible en partie',
      chercher: "statut = 'Partiel (' + stock + '/' + l.quantite + ')';",
      remplacer: "statut = 'Partiel ' + stock + '/' + l.quantite;",
    },
    {
      comportement: 'la mention des commandes urgentes',
      chercher: 'if (commande.urgente == true) {',
      remplacer: 'if (commande.urgente == "oui") {',
    },
    {
      comportement: 'le traitement des lignes de quantité nulle',
      chercher: 'if (commande.lignes[i].quantite == 0) continue;',
      remplacer: 'if (commande.lignes[i].quantite < 0) continue;',
    },
    {
      comportement: 'le traitement d’une référence présente sur deux lignes',
      chercher: '    lignes.push({ ref: commande.lignes[i].ref,',
      remplacer:
        '    var dejaVue = false;\n' +
        '    for (var m = 0; m < lignes.length; m++) {\n' +
        '      if (lignes[m].ref == commande.lignes[i].ref) {\n' +
        '        lignes[m].quantite = lignes[m].quantite + commande.lignes[i].quantite;\n' +
        '        dejaVue = true;\n' +
        '      }\n' +
        '    }\n' +
        '    if (!dejaVue) lignes.push({ ref: commande.lignes[i].ref,',
    },
    {
      comportement: 'le statut d’un article dont le stock vaut 0',
      chercher: 'if (stock == undefined) {',
      remplacer: 'if (stock == undefined || stock == 0) {',
    },
    {
      comportement: 'le statut d’un article dont le stock égale exactement la quantité',
      chercher: 'if (stock >= l.quantite) {',
      remplacer: 'if (stock > l.quantite) {',
    },
    {
      comportement: 'l’ordre des mentions d’un article à la fois fragile et lourd',
      chercher: "mentions = mentions + ' [2 PERS.]';",
      remplacer: "mentions = ' [2 PERS.]' + mentions;",
    },
  ],
};
