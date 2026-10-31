# df-exercices

Exercices de la formation « Développeurs : boostez vos performances grâce à l’IA ». Un sous-dossier par exercice, autonome.

## Installer

1. Cloner le dépôt : `git clone https://github.com/alexxzee/df-exercices.git`
2. Entrer dans le dossier : `cd df-exercices`
3. Installer l’outillage, une seule fois, à la racine : `npm install`

## Travailler un exercice

Ouvrez **le sous-dossier de l’exercice**, jamais la racine : dans VS Code, `Fichier`, `Ouvrir le dossier…`, puis `df-exercices/03-refactoriser`. L’assistant lit alors le contexte et les outils propres à cet exercice.

Dans le terminal du sous-dossier :

| Commande | Effet |
|---|---|
| `npm test` | lance les tests du dossier `test/` |
| `npm run lint` | analyse statique (ESLint, règle de complexité) |
| `npm run verifier-filet` | essaie quelques modifications du code d’origine et compte celles que vos tests détectent ; demande la clé que donne le formateur |
| `npm run reprise -- <partie>` | pose l’état prêt d’une partie si vous avez pris du retard (une copie de votre travail est gardée dans `.sauvegardes/`) |

## Contenu

| Dossier | Exercice |
|---|---|
| `03-refactoriser/` | caractériser puis refactoriser le bon de préparation |
| `outils/` | outillage partagé par les exercices : ne pas modifier |
