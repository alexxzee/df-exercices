'use strict';

module.exports = {
  ...require('./clients/repertoire'),
  ...require('./catalogue/recherche'),
  ...require('./commandes/creation'),
  ...require('./devis/estimation'),
  ...require('./devis/conversion'),
  ...require('./factures/facture'),
  ...require('./stocks/disponibilite'),
};
