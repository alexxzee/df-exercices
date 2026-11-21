Relais : application Symfony de suivi des demandes de SAV, données fictives, état gardé dans la session du navigateur.
Lancer l’application : `composer install`, puis `php -S 127.0.0.1:8000 -t public`, puis ouvrir http://127.0.0.1:8000/demandes.
Lancer les tests : `npm ci`, puis `npx playwright test` (démarre l’application si elle ne tourne pas) ; les tickets sont dans `tickets/`.
