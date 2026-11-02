# df-exercices

Exercices de la formation « Développeurs : boostez vos performances grâce à l’IA ». Un sous-dossier par exercice, autonome.

## Installer

1. Cloner le dépôt : `git clone --depth 1 https://github.com/alexxzee/df-exercices.git` (`--depth 1` : le dernier état seul, sans l’historique de préparation des exercices)
2. Entrer dans le dossier : `cd df-exercices`
3. Installer l’outillage, une seule fois, à la racine : `npm install`

## Travailler un exercice

Ouvrez **le sous-dossier de l’exercice**, jamais la racine : dans VS Code, `Fichier`, `Ouvrir le dossier…`, puis le sous-dossier de l’exercice, par exemple `df-exercices/01-date-livraison`. L’assistant lit alors le contexte et les outils propres à cet exercice.

Dans le terminal du sous-dossier (les commandes disponibles dépendent de l’exercice) :

| Commande | Effet |
|---|---|
| `npm test` | lance les tests du dossier `test/` |
| `npm run verifier` | lance votre fonction sur des situations écrites par la formation et compte celles qui donnent le bon résultat ; demande la clé que donne le formateur |
| `npm run lint` | analyse statique (ESLint, règle de complexité) |
| `npm run verifier-filet` | essaie quelques modifications du code d’origine et compte celles que vos tests détectent ; demande la clé que donne le formateur |
| `npm run test:couverture` | lance les mêmes tests et affiche le rapport de couverture : les lignes et les branches du code que les tests exécutent |
| `npm run verifier-tests` | lance vos tests sur un code conforme à la spec, puis sur des copies où un écart a été glissé, et compte les écarts que vos tests détectent ; demande la clé que donne le formateur |
| `npm run anonymat -- <fichier>` | compte, dans un ticket, les données personnelles et la clé encore lisibles, et les informations utiles au diagnostic |
| `npm run hook` | lance la commande de hook déclarée pour votre outil sur trois actions simulées et dit lesquelles elle refuse |
| `npm run verifier-audit` | compare le tableau de `AUDIT.md` aux emplacements des failles attendues et compte celles que l’audit a localisées ; demande la clé que donne le formateur |
| `npm run verifier-explorer` | vérifie, sur trois lignes, l’endroit où la règle demandée est appliquée, la règle elle-même et le test qui la protège ; demande la clé écrite dans la fiche |
| `npm run reprise -- <partie>` | pose l’état prêt d’une partie si vous avez pris du retard (une copie de votre travail est gardée dans `.sauvegardes/`) |

## Contenu

| Dossier | Exercice |
|---|---|
| `01-date-livraison/` | écrire la date de livraison prévue, du ticket au test, puis les consignes de l’équipe |
| `02-1-tests-depuis-la-spec/` | écrire les tests du calcul des devis depuis la spec, faire corriger le calcul, ranger le prompt réutilisable |
| `02-2-documenter/` | décrire la pull request du calcul corrigé, écrire la JSDoc et le README, vérifier chaque élément dans le dossier |
| `03-refactoriser/` | caractériser puis refactoriser le bon de préparation |
| `04-auditer/` | construire un agent auditeur en lecture seule, le mesurer et le corriger, puis corriger une faille du script de synchronisation des tarifs (Python) |
| `05-proteger/` | fouiller une copie exposée, anonymiser un ticket avant de le confier, brancher un hook qui refuse à l’agent la lecture des secrets |
| `08-1-explorer/` | faire chercher un agent explorateur en lecture seule avant de modifier, dans un dépôt d’une soixantaine de fichiers |
| `outils/` | outillage partagé par les exercices : ne pas modifier |
