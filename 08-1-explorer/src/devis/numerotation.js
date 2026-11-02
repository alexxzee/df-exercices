'use strict';

const { numeroter } = require('../utils/identifiants');

function numeroDevis(date, rang) {
  return numeroter('DEV', date.getUTCFullYear(), rang);
}

module.exports = { numeroDevis };
