// Fichier de la formation : ne pas modifier.
'use strict';

module.exports = {
  port: Number(process.env.PORT) || 3000,
  journal: process.env.DF_JOURNAL === '1',
};
