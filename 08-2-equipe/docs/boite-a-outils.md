# Boîte à outils : l’outil d’abord, le modèle ensuite

Ce qu’une commande sait faire se confie à une commande. Une commande donne toujours le même résultat et ne coûte aucun crédit ; un modèle la lance seulement si l’on veut son résultat dans la conversation.

| Tâche | Commande de contrôle | Variante qui écrit | Qui la lance |
|---|---|---|---|
| Chercher un mot dans le code | `git grep -n "<mot>"` (`rg -n "<mot>"` s’il est installé) | aucune | vous, ou l’`outilleur` |
| Formater | `npx prettier --check src test` | `npx prettier --write src test` | contrôle : l’`outilleur` ; écriture : vous, ou `dev-web` |
| Corriger le style | `npx eslint .` | `npx eslint . --fix` | contrôle : l’`outilleur` ; écriture : vous, ou `dev-web` |
| Renommer un symbole | aucune | **F2**, Renommer le symbole, dans l’éditeur | vous, dans l’éditeur |
| Tester | `npm test` | aucune | vous, ou l’`outilleur` |
| Vérifier un paquet avant de l’installer | `npm view <paquet> name version time.created` | aucune | vous, ou l’`outilleur` |
| Chercher un secret | `gitleaks dir . --redact` | aucune | vous, ou l’`outilleur` |
| Analyser du Python | `bandit -r <dossier>` | aucune | l’`outilleur`, seulement si le dossier contient du Python |

## Vérifier

Les commandes à lancer avant de dire qu’un travail est fini, dans cet ordre :

1. `npm test`
2. `npx eslint .`
3. `npx prettier --check src test`
4. `gitleaks dir . --redact`

`npm run verifier` les lance toutes les quatre et dit lesquelles échouent.
