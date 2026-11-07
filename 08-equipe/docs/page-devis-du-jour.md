# Page des devis du jour

Demande du service commercial de Delmas & Fournier, octobre 2026.

## Besoin

Chaque soir, avant de partir, le commercial relit les devis faits dans la journée pour relancer le lendemain les clients qui hésitent. Il les consulte depuis son navigateur, sans passer par l’API JSON.

## Règles

1. `GET /devis/du-jour` rend une page HTML.
2. La page liste les devis dont la date est celle du jour, et seulement ceux-là.
3. Pour chaque devis : son numéro, le nom du client et le total TTC en euros, au format français (`1 234,50 €`).
4. Le nom du client s’affiche exactement tel qu’il est écrit dans la fiche client, quels que soient ses caractères.
5. Sans devis du jour, la page affiche le texte « Aucun devis aujourd’hui ».
6. Aucune nouvelle dépendance npm.

## Hors périmètre

Le filtre par commercial, l’export et la mise en forme graphique viendront plus tard.
