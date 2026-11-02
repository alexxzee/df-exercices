'use strict';

const { numeroter } = require('../utils/identifiants');

function numeroFacture(date, rang) {
  return numeroter('FAC', date.getUTCFullYear(), rang);
}

module.exports = { numeroFacture };
