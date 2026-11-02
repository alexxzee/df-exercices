# Organisation du code

`src/` compte un dossier par domaine : `clients`, `catalogue`, `commandes`, `devis`, `factures`, `stocks`, `livraison`, et `utils` pour les fonctions communes (montants, dates, texte, numéros).

Chaque domaine expose ses fonctions par ses modules ; `src/index.js` regroupe celles qu’utilise l’interface. Un module ne dépend que de `utils` et des domaines dont il a besoin : le passage d’un devis à une commande, par exemple, appelle le domaine des commandes.
