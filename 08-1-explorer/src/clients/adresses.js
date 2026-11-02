'use strict';

function formaterAdresse(adresse) {
  const lignes = [adresse.rue, adresse.codePostal + ' ' + adresse.ville];
  if (adresse.complement) lignes.splice(1, 0, adresse.complement);
  return lignes.join('\n');
}

module.exports = { formaterAdresse };
