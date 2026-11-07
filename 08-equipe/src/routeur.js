// Fichier de la formation : ne pas modifier.
'use strict';

// Petit routeur, sans dépendance. Les routes sont essayées dans l'ordre où elles
// sont déclarées : la première qui correspond au chemin répond.
// Un morceau de motif qui commence par « : » (par exemple :id) accepte n'importe
// quelle valeur et la range dans requete.params.

const { json } = require('./reponses');

function decouper(chemin) {
  return chemin.split('/').filter(Boolean);
}

// Un morceau mal encodé (par exemple %ZZ) ne correspond à aucune route.
function decoder(morceau) {
  try {
    return decodeURIComponent(morceau);
  } catch {
    return null;
  }
}

function correspondre(motif, morceaux) {
  if (motif.length !== morceaux.length) return null;
  const params = {};
  for (let i = 0; i < motif.length; i++) {
    if (motif[i].startsWith(':')) {
      const valeur = decoder(morceaux[i]);
      if (valeur === null) return null;
      params[motif[i].slice(1)] = valeur;
    } else if (motif[i] !== morceaux[i]) return null;
  }
  return params;
}

function creerRouteur() {
  const routes = [];

  function ajouter(methode, motif, traitement) {
    routes.push({ methode, motif: decouper(motif), traitement });
  }

  // requete : { methode: 'GET', chemin: '/devis/3?client=2' }
  // Rend une réponse : { statut, type, corps }.
  function traiter(requete) {
    const [chemin, chaine = ''] = requete.chemin.split('?');
    const morceaux = decouper(chemin);
    const query = Object.fromEntries(new URLSearchParams(chaine));
    for (const route of routes) {
      if (route.methode !== requete.methode) continue;
      const params = correspondre(route.motif, morceaux);
      if (params) return route.traitement({ ...requete, params, query });
    }
    return json(404, { erreur: 'Route inconnue' });
  }

  return {
    get: (motif, traitement) => ajouter('GET', motif, traitement),
    traiter,
  };
}

module.exports = { creerRouteur };
