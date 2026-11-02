# Frais de port (Delmas & Fournier)

Le module calcule les frais de port d’une commande : poids facturé, tarif selon le poids et la destination, express, franco de port. Il tourne en production depuis 2020 et n’a aucun test.

## Fichiers

- `src/frais-port.js` : `calculerFraisPort(commande)` renvoie `{ poidsKg, fraisHT }`.
- `docs/regles-frais-de-port.md` : règles du service logistique. Fichier de la formation : ne pas modifier.
- `donnees/commandes.json` : commandes fictives, au format de la production.
- `test/` : tests `node:test`.
- `QUESTIONS.md` : questions à poser au métier.

## Commandes

- `npm test` : lance les tests de `test/`.
- `npm run lint` : ESLint, complexité maximale 10 par fonction.
- `npm run verifier-filet` : mesure si les tests détectent de petites modifications du code. Il demande une clé : c’est l’utilisateur qui le lance, dans son terminal.

## Conventions

- JavaScript CommonJS (`require`, `module.exports`), Node.js 24, aucune dépendance d’exécution.
- `const` et `let`, comparaisons strictes `===`.
- Noms de variables et de fonctions en français, sans accent.
- Tests avec `node:test` et `node:assert/strict` ; un fichier `test/<module>.test.js`.
- Les frais calculés sont facturés aux clients : toute différence de résultat, même d’un centime, change une facture.

## Boîte à outils

- Skill `caracteriser-avant-de-toucher` : écrire les tests de caractérisation avant toute modification.
- Agent `refacto` : refactoriser par petites étapes, sous filet de tests vert, sans changer le comportement.
