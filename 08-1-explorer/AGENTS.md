# D&F Commandes (Delmas & Fournier)

Application de devis et de commandes de Delmas & Fournier, négociant en matériaux : catalogue, clients, devis, commandes, factures, stocks et livraison.

## Fichiers

- `src/` : un dossier par domaine (`clients`, `catalogue`, `commandes`, `devis`, `factures`, `stocks`, `livraison`) et `utils` pour les fonctions communes.
- `test/` : tests `node:test`.
- `docs/` : documentation du projet (voir `docs/README.md`).

## Commandes

- `npm test` : lance les tests de `test/`.
- `npm run verifier-explorer` : vérifie le résultat de l’exercice. Il demande la clé de la fiche : c’est l’utilisateur qui le lance, dans son terminal.

## Conventions

- JavaScript CommonJS (`require`, `module.exports`), Node.js 24, aucune dépendance d’exécution.
- `const` et `let`, comparaisons strictes `===`.
- Noms de variables et de fonctions en français, sans accent.
- Tests avec `node:test` et `node:assert/strict`.
- Montants en euros hors taxes, arrondis au centime.

## Boîte à outils

- `prompts/tests-depuis-la-spec.md` : demande de tests écrits depuis une spec, à joindre à toute demande de tests.
- Skill `caracteriser-avant-de-toucher` : figer le comportement d’un code avant de le modifier.
- Agent `refacto` : refactoriser par petites étapes, sous filet de tests.
- Agent `auditeur` : auditer la sécurité d’un fichier en lecture seule.
- Hook `garde-secrets` (`hooks/garde-secrets.js`) : refuse à l’agent la lecture de `.env`.
