# Remises des devis (Delmas & Fournier)

Le module calcule les remises d’un devis D&F Commandes : remise sur quantité, remise grand compte et plafond.

## Fichiers

- `src/devis/remises.js` : `tauxQuantite(quantite)` et `remisesDevis(lignes, grandCompte)`.
- `test/devis/` : tests `node:test`.
- `docs/regles-remises.md` : règles de remise de l’entreprise, source des résultats attendus.

## Commandes

- `npm test` : lance les tests de `test/`.
- `npm run lint` : analyse statique (ESLint).

## Conventions

- JavaScript CommonJS (`require`, `module.exports`), Node.js 24, aucune dépendance d’exécution.
- `const` et `let`, comparaisons strictes `===`.
- Noms de variables et de fonctions en français, sans accent.
- Tests avec `node:test` et `node:assert/strict`, rangés dans `test/devis/`.
- Montants en euros hors taxes, arrondis au centime.
