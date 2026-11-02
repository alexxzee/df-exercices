# Règles des frais de port

Fichier de la formation : ne pas modifier.

Règles du service logistique de Delmas & Fournier, en vigueur depuis le 1er janvier 2024. Tous les montants sont hors taxes, en euros.

## 1. Poids facturé

Le poids facturé est la somme, sur toutes les lignes de la commande, de la quantité multipliée par le poids unitaire de l’article. Il est arrondi au kilo supérieur : une commande de 5,2 kg est facturée 6 kg. Il figure sur la facture.

## 2. Mode de livraison

Trois modes sont proposés au client :

| Mode | Valeur dans la commande | Frais |
|---|---|---|
| Livraison standard | `standard` | Selon les sections 3 à 6 |
| Livraison express | `express` | Selon les sections 3 à 6 |
| Retrait au dépôt de Colomiers | `retrait` | Aucuns frais, quels que soient le poids et la destination |

## 3. Tarif de base, selon le poids facturé

| Poids facturé | Tarif de base |
|---|---|
| Jusqu’à 5 kg inclus | 6,90 € |
| Plus de 5 kg, jusqu’à 30 kg inclus | 12,50 € |
| Plus de 30 kg, jusqu’à 100 kg inclus | 29,00 € |
| Plus de 100 kg (envoi sur palette) | 85,00 € |

## 4. Destination

Delmas & Fournier livre la France (code pays `FR`), la Belgique (`BE`) et le Luxembourg (`LU`).

- France : un supplément de 15,00 € s’ajoute au tarif de base pour la Corse, c’est-à-dire tout code postal qui commence par `20`.
- Belgique et Luxembourg : le tarif de base est multiplié par 1,5.
- Tout autre pays : la commande est refusée, avec le message « Pays non desservi : » suivi du code pays.

## 5. Livraison express

L’express ajoute un supplément de 9,90 € après l’application de la section 4. Il est impossible pour un envoi sur palette (plus de 100 kg) : la commande est refusée, avec le message « Express impossible au-delà de 100 kg ».

## 6. Franco de port

Le franco de port supprime les frais de transport des sections 3 et 4 quand le montant des marchandises (somme des quantités multipliées par les prix unitaires) atteint le seuil du client :

- à partir de 500,00 € pour un client ordinaire ;
- à partir de 300,00 € pour un client grand compte.

Le franco ne s’applique jamais à un envoi sur palette (plus de 100 kg). Le supplément express n’est jamais couvert par le franco : il reste facturé.

## 7. Arrondi

Les frais sont arrondis au centime.
