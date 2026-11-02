'use strict';

// Numéro lisible au format PREFIXE-AAAA-NNNNN, repris par la comptabilité.
function numeroter(prefixe, annee, rang) {
  return prefixe + '-' + annee + '-' + String(rang).padStart(5, '0');
}

module.exports = { numeroter };
