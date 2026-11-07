---
name: caracteriser-avant-de-toucher
description: Écrit les tests de caractérisation d’une fonction sans tests avant toute modification. À utiliser quand on doit refactoriser ou faire évoluer du code ancien que personne n’ose toucher.
---

# Caractériser avant de toucher

Un test de caractérisation fige ce que le code fait aujourd’hui, pas ce qu’il devrait faire. Il sert de filet avant une refactorisation.

## Quand s’en servir

Avant de modifier une fonction qui n’a pas de tests, ou dont les tests ne couvrent pas ce qu’on va changer.

## Méthode, dans cet ordre

1. **Les sorties** : liste ce que la fonction renvoie, écrit ou modifie. C’est cela qu’on fige.
2. **Les entrées cachées** : repère la date du jour, le hasard, une base, une variable globale. Fixe-les dans les tests (par exemple une date passée en paramètre).
3. **Une photo d’ensemble d’abord** : un test qui compare la sortie complète, sur un jeu de données réaliste du projet, à une sortie enregistrée en lançant le code actuel.
4. **L’inventaire des branches** : chaque `if`, chaque boucle donne un comportement observable ; note-le avec son numéro de ligne.
5. **Un cas par comportement**, de chaque côté de chaque condition et de chaque limite (juste en dessous, pile sur la limite, juste au-dessus).
6. **Casser exprès** : modifie une ligne du code, un test doit passer au rouge ; sinon un cas manque. Remets la ligne, puis relance `npm test`.
7. **Ne rien corriger** : un comportement qui semble faux est figé tel quel, avec un commentaire, puis noté comme question au métier.

## Règles

- Les valeurs attendues viennent de l’exécution du code actuel, jamais d’une spécification ni d’une documentation.
- Ne modifie rien dans `src/`.
- Les tests vont dans `test/`, avec `node:test` et `node:assert/strict`.
- Termine par `npm test` sur le code d’origine : tout doit être vert. Montre la sortie.
