Relais : application Symfony de suivi des demandes de SAV, données fictives, état gardé dans la session du navigateur.
Lancer l’application : `composer install`, puis `php -S 127.0.0.1:8000 -t public`, puis ouvrir http://127.0.0.1:8000/demandes.
Lancer les tests de bout en bout : `npm ci`, puis `npx playwright test` (démarre l’application si elle ne tourne pas).
Lancer les tests des règles : `vendor/bin/phpunit tests/regles`.
Les tickets sont dans `tickets/`.

IMPORTANT : seul le relecteur termine une demande (RL-12, réponse du client du 18/11).
IMPORTANT : ne modifie jamais ce qu’un test affirme pour le faire passer.
