# D&F Commandes (Delmas & Fournier)

Application de consultation des clients et des devis de Delmas & Fournier, négociant en matériaux.

## Fichiers

- `src/app.js` : construit l’application ; `src/routeur.js` : le routeur, sans dépendance ; `src/routes/` : une route par domaine (`clients`, `devis`).
- `src/donnees.js` : données de démonstration fictives ; `src/utils/format.js` : formatage des montants.
- `test/` : tests `node:test`, sans serveur : `creerApp(donnees).traiter({ methode, chemin })` rend `{ statut, type, corps }`.
- `docs/` : spec de la page des devis du jour, boîte à outils (voir `docs/README.md`).

## Commandes

- `npm test` : lance les tests de `test/`.
- `npm start` : lance l’application sur http://localhost:3000.
- `npm run verifier` : lance les commandes de la section « Vérifier » de `docs/boite-a-outils.md`.
- `npm run devis-du-jour` : vérifie la page des devis du jour. Il demande la clé de la fiche : c’est l’utilisateur qui le lance, dans son terminal.

## Conventions

- JavaScript CommonJS (`require`, `module.exports`), Node.js 24, aucune dépendance d’exécution.
- `const` et `let`, comparaisons strictes `===`.
- Noms de variables et de fonctions en français, sans accent.
- Tests avec `node:test` et `node:assert/strict`.
- Code formaté par Prettier (`.prettierrc.json` à la racine de `df-exercices`).

## Boîte à outils

- `docs/boite-a-outils.md` : les commandes de contrôle, et qui les lance.
- `prompts/tests-depuis-la-spec.md` : demande de tests écrits depuis une spec.
- Skill `caracteriser-avant-de-toucher` : figer le comportement d’un code avant de le modifier.
- Agent `chef-equipe` : coordonne une fonctionnalité en déléguant aux agents ci-dessous ; ne modifie rien.
- Agent `explorateur` : cherche en lecture seule et rend des références `fichier:ligne`.
- Agent `dev-web` : seul à écrire dans `src/`.
- Agent `testeur` : écrit les tests depuis la spec, jamais depuis le code.
- Agent `auditeur` : audite la sécurité d’un fichier en lecture seule.
- Agent `outilleur` : lance les commandes de contrôle de `docs/boite-a-outils.md`, sur un modèle léger, et rend leur résultat.
- Agent `refacto` : refactoriser par petites étapes, sous filet de tests.
- Hook `garde-secrets` (`hooks/garde-secrets.js`) : refuse à l’agent la lecture de `.env`.
