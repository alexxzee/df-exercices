# Calcul des devis : application D&F Commandes

Ce dossier calcule les devis de Delmas & Fournier : lignes, remises, frais de port, TVA.
Le module tourne en production ; l’équipe doit faire évoluer les remises.

## Commandes

- `npm test` : lance les tests de `test/`.
- `npm run test:couverture` : les mêmes tests, avec le rapport de couverture.
- `npm run verifier-tests` : contrôle du formateur. Il demande une clé : l’utilisateur le lance lui-même dans son terminal, ne le lance pas.

## Conventions

- JavaScript CommonJS, Node.js 24, aucune dépendance.
- Noms de variables et de fonctions en français, sans accent.
- Tests `node:test` et `node:assert/strict`, dans `test/`.
- Les montants sont des nombres en euros, arrondis au centime.

## À ne pas faire

- Ne jamais modifier un test existant pour le faire passer : signaler le désaccord.
