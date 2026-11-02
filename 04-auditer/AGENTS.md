# Synchronisation des tarifs (Delmas & Fournier)

Le script `sync_tarifs.py` met à jour la base des produits de Delmas & Fournier à partir du fichier de tarifs du fournisseur Matériaux Rivière. Il a été écrit avec un assistant IA et tourne en production depuis mars 2025. Toutes les données, adresses et identifiants de ce dossier sont fictifs.

## Fichiers

- `sync_tarifs.py` : le script (import du fichier fournisseur, recherche d’une référence, archivage).
- `data/tarifs_materiaux_riviere.csv` : un fichier fournisseur, au format de la production.
- `tests/test_sync.py` : les tests du comportement attendu. Fichier de la formation : ne pas modifier.
- `tests/test_failles.py` : les tests ajoutés pendant l’atelier.
- `AUDIT.md` : le compte rendu d’audit.

## Commandes

- `python3 -m unittest` : lance les tests de `tests/` (sous Windows : `py -m unittest`).
- `python3 -m bandit sync_tarifs.py` : analyse statique de sécurité (Bandit).
- `npm run verifier-audit` : compare le tableau de `AUDIT.md` aux emplacements attendus. Il demande la clé du formateur : c’est l’utilisateur qui le lance, dans son terminal.

## Conventions

- Python 3, bibliothèque standard seulement, aucune dépendance d’exécution.
- Noms de variables et de fonctions en français, sans accent.
- Tests avec `unittest`, un fichier par sujet dans `tests/`.
- Corriger le script ne doit pas changer ce qu’il fait pour un fichier fournisseur légitime : `tests/test_sync.py` le vérifie.
