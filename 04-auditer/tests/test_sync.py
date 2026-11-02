# Fichier de la formation : ne pas modifier.
"""Tests du comportement attendu de sync_tarifs.py.

Ils doivent rester au vert après le patch de sécurité : corriger une faille
ne doit pas changer ce que le script fait pour un fichier légitime.
Vos propres tests vont dans tests/test_failles.py.
Lancement : python3 -m unittest
"""
# Ce fichier teste le script sync_tarifs.py (étude de cas en binôme) sur son
# usage normal : importer le fichier fournisseur data/tarifs_materiaux_riviere.csv
# dans une base SQLite, calculer les prix remisés, retrouver un produit par sa
# référence. Chaque test part d'une base neuve, créée dans un dossier temporaire :
# la base réelle du script n'est jamais touchée.
import os
import sqlite3
import sys
import tempfile
import unittest

# Rend sync_tarifs.py (à la racine du dépôt) importable depuis le dossier tests/.
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import sync_tarifs  # noqa: E402

# Le fichier fournisseur légitime livré avec le dépôt : 8 produits.
FICHIER = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
                       "data", "tarifs_materiaux_riviere.csv")


class TestSynchronisation(unittest.TestCase):
    # Avant chaque test : un dossier jetable et une base vide (table produits créée).
    def setUp(self):
        self.dossier = tempfile.TemporaryDirectory()
        self.connexion = sync_tarifs.ouvrir_base(os.path.join(self.dossier.name, "t.db"))

    # Après chaque test : base fermée, dossier jetable supprimé avec son contenu.
    def tearDown(self):
        self.connexion.close()
        self.dossier.cleanup()

    # Vérifie que l'import lit tout le fichier fournisseur.
    # Données : le CSV légitime, 8 lignes de produits sous l'en-tête.
    # Attendu : importer() renvoie 8, le nombre de produits mis à jour.
    # Pourquoi : aucune ligne légitime ne doit être perdue ni refusée.
    def test_importe_toutes_les_lignes(self):
        self.assertEqual(sync_tarifs.importer(FICHIER, self.connexion), 8)  # 8 lignes de produits dans le CSV

    # Vérifie la formule de prix : prix HT diminué de la remise, arrondi au centime.
    # Données : LAINE-R5, prix HT 42.00, remise 8 %.
    # Attendu : chercher() renvoie la référence, le libellé et le prix 38.64.
    # Pourquoi : c'est le calcul métier du script ; il doit rester identique.
    def test_applique_la_formule_de_prix(self):
        sync_tarifs.importer(FICHIER, self.connexion)
        self.assertEqual(sync_tarifs.chercher("LAINE-R5", self.connexion),
                         [("LAINE-R5", "Laine de verre R5, rouleau", 38.64)])  # 42.00 x (1 - 8/100) = 38.64

    # Vérifie qu'un produit sans remise garde son prix fournisseur.
    # Données : PLAQ-BA13, prix HT 9.80, remise 0.
    # Attendu : le prix enregistré vaut 9.8 (troisième colonne du résultat).
    # Pourquoi : cas limite de la formule, remise nulle.
    def test_prix_sans_remise(self):
        sync_tarifs.importer(FICHIER, self.connexion)
        self.assertEqual(sync_tarifs.chercher("PLAQ-BA13", self.connexion)[0][2], 9.8)  # [0] premier produit, [2] colonne prix

    # Vérifie la recherche d'une référence absente du catalogue.
    # Données : base remplie avec le CSV légitime, référence « INCONNUE ».
    # Attendu : une liste vide, sans erreur.
    # Pourquoi : une référence inconnue n'est pas une erreur du script.
    def test_reference_inconnue(self):
        sync_tarifs.importer(FICHIER, self.connexion)
        self.assertEqual(sync_tarifs.chercher("INCONNUE", self.connexion), [])  # aucun produit, pas d'exception

    # Vérifie qu'un libellé contenant une apostrophe est importé puis relu tel quel.
    # Données : un petit CSV écrit par le test, une seule ligne, « Peinture d'intérieur ».
    # Attendu : le libellé relu en base est exactement « Peinture d'intérieur ».
    # Pourquoi : les libellés fournisseurs contiennent couramment des apostrophes.
    def test_libelle_avec_apostrophe(self):
        chemin = os.path.join(self.dossier.name, "a.csv")  # CSV fabriqué dans le dossier jetable
        with open(chemin, "w", encoding="utf-8") as f:
            f.write("reference;libelle;prix_ht;remise;fiche_url;fiche_nom\n"  # même en-tête que le fichier fournisseur
                    "PEINT-BL;Peinture d'intérieur;64.00;0;;\n")  # sans fiche technique : deux colonnes vides
        sync_tarifs.importer(chemin, self.connexion)
        self.assertEqual(sync_tarifs.chercher("PEINT-BL", self.connexion)[0][1], "Peinture d'intérieur")  # [0][1] : libellé du produit


if __name__ == "__main__":
    unittest.main()
