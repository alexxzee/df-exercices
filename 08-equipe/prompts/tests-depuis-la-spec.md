## Contexte

Le module [CODE] doit respecter les règles décrites dans [SPEC].
La spec est la source des résultats attendus, même si le code diverge.

## Tâche

Écris dans [TESTS] des tests `node:test` avec `node:assert/strict`.
Couvre chaque règle et chaque frontière à la valeur exacte et juste en dessous.
Inclus les seuils, plafonds et arrondis applicables.
Calcule chaque attendu depuis [SPEC] et explicite le calcul dans un commentaire.
Au-dessus de chaque test, indique le paragraphe de [SPEC] qui justifie l'attendu.

## Contraintes

Modifie uniquement [TESTS], sans altérer les tests existants pour les faire passer.
Utilise CommonJS, des noms français sans accent et aucune dépendance supplémentaire.
Ne déduis jamais les attendus du code ; une divergence doit produire un test qui échoue.
Signale les désaccords et les ambiguïtés de la spec sans inventer de règle ni corriger [CODE].
Ne lance pas les tests ; laisse l'utilisateur exécuter [COMMANDE DE TEST].

## Vérification

Terminé lorsque l'utilisateur a lancé [COMMANDE DE TEST], que chaque test rouge cite le paragraphe de [SPEC] qui le justifie, que chaque règle et frontière applicable est couverte, que chaque attendu est calculé et rattaché à [SPEC], que seul [TESTS] a été modifié et que les ambiguïtés éventuelles sont signalées. La réussite des tests n'est pas un critère de fin.
