// Fichier de la formation : ne pas modifier.
// Lance, une par une, les commandes de la section « Vérifier » de docs/boite-a-outils.md
// et dit lesquelles échouent. Aucune n'écrit dans le projet.
// Usage (depuis le sous-dossier de l'exercice) : npm run verifier
'use strict';

const { spawnSync } = require('node:child_process');

const COMMANDES = ['npm test', 'npx eslint .', 'npx prettier --check src test', 'gitleaks dir . --redact'];

const echecs = [];
console.log('Vérifier (docs/boite-a-outils.md) :');
for (const commande of COMMANDES) {
  const resultat = spawnSync(commande, { shell: true, encoding: 'utf8', timeout: 120000 });
  let etat = 'réussie';
  if (resultat.status !== 0) {
    const sortie = (resultat.stdout || '') + (resultat.stderr || '');
    const introuvable =
      resultat.status === 127 || /not found|introuvable|n.est pas reconnu|not recognized/i.test(sortie);
    etat = introuvable ? 'en échec (commande introuvable)' : 'en échec';
    echecs.push(commande);
  }
  console.log('  ' + commande + ' : ' + etat);
}
console.log(
  echecs.length === 0
    ? 'Bilan : les ' + COMMANDES.length + ' commandes réussissent.'
    : 'Bilan : ' +
        echecs.length +
        ' commande' +
        (echecs.length > 1 ? 's' : '') +
        ' en échec sur ' +
        COMMANDES.length +
        ' : ' +
        echecs.map((commande) => '« ' + commande + ' »').join(', '),
);
process.exitCode = echecs.length === 0 ? 0 : 1;
