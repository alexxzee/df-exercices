'use strict';

const EUROS = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });

// 1234.5 donne « 1 234,50 € » (espaces insécables, à la française).
function formaterEuros(montant) {
  return EUROS.format(montant);
}

module.exports = { formaterEuros };
