# Bon de préparation (Delmas & Fournier)

Le module édite le bon de préparation que l’entrepôt imprime pour chaque commande : un texte, ligne par ligne, que le préparateur suit dans les allées. Il tourne en production depuis 2021.

## Fichiers

- `src/bon-preparation.js` : `editerBonPreparation(commande, catalogue, stocks, aujourdHui)` renvoie le texte du bon.
- `donnees/` : commandes, catalogue et stocks fictifs, au format de la production.
- `test/` : tests `node:test`.

## Commandes

- `npm test` : lance les tests de `test/`.
- `npm run lint` : ESLint, complexité maximale 10 par fonction.
- `npm run verifier-filet` : mesure si les tests détectent de petites modifications du code. Il demande la clé du formateur : c’est l’utilisateur qui le lance, dans son terminal.

## Conventions

- JavaScript CommonJS (`require`, `module.exports`), Node.js 24, aucune dépendance d’exécution.
- `const` et `let`, comparaisons strictes `===`.
- Noms de variables et de fonctions en français, sans accent.
- Tests avec `node:test` et `node:assert/strict` ; un fichier `test/<module>.test.js`.
- Le texte produit est lu par l’entrepôt : toute différence de sortie, même un espace, change le bon imprimé.

## Boîte à outils

- `prompts/tests-depuis-la-spec.md` : demande de tests écrits depuis une spec, à joindre à toute demande de tests.

## Repères du code durable

1. Conventions du projet respectées (celles de ce fichier).
2. Commentaires sur le pourquoi, pas le comment.
3. Fonctions courtes, une responsabilité chacune.
4. Documentation à jour : ce fichier suit le code.
5. Tests sur les cas limites.
