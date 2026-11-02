# Calcul des devis : application D&F Commandes

Ce dossier calcule les devis de Delmas & Fournier : lignes, remises, frais de port, TVA.
Le module tourne en production. Le calcul vient d’être corrigé selon `docs/regles-remises.md` ; la pull request de cette correction est à documenter.

## Commandes

- `npm test` : lance les tests de `test/`.
- `npm run test:couverture` : les mêmes tests, avec le rapport de couverture.

## Conventions

- JavaScript CommonJS, Node.js 24, aucune dépendance.
- Noms de variables et de fonctions en français, sans accent.
- Tests `node:test` et `node:assert/strict`, dans `test/`.
- Les montants sont des nombres en euros, arrondis au centime.

## Boîte à outils

- `prompts/tests-depuis-la-spec.md` : demande de tests écrits depuis une spec, à joindre à toute demande de tests.

## À ne pas faire

- Ne jamais modifier un test existant pour le faire passer : signaler le désaccord.
