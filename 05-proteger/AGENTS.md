# Remises des devis (Delmas & Fournier)

Le module calcule la remise par quantité d’une ligne de devis D&F Commandes. Le service client s’en sert pour répondre aux tickets des clients professionnels.

## Fichiers

- `src/remises.js` : `tauxRemiseQuantite(quantite)` et `montantLigne(quantite, prixUnitaireHT)`.
- `test/` : tests `node:test`.
- `ticket.txt` : ticket reçu du support, à traiter.
- `SECURITE.md` : relevé d’incident, tenu par l’équipe.

## Commandes

- `npm test` : lance les tests de `test/`.
- `npm run anonymat -- <fichier>` : compte les données personnelles et les informations utiles d’un ticket.
- `npm run hook` : vérifie, sans assistant, les contrôles déclarés pour les outils d’IA.

## Conventions

- JavaScript CommonJS (`require`, `module.exports`), Node.js 24, aucune dépendance d’exécution.
- `const` et `let`, comparaisons strictes `===`.
- Noms de variables et de fonctions en français, sans accent.
- Tests avec `node:test` et `node:assert/strict` ; un fichier `test/<module>.test.js`.
- Montants en euros hors taxes, arrondis au centime.
