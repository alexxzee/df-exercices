# RL-12 : suivre une demande de SAV de l’assignation à la clôture

Préparation : brouillon
Dépend de : aucun
Source : transcriptions/2026-11-17-sav-delmas-fournier.md (10:03, 10:04, 10:07)

## Contexte
L’administration des ventes de Delmas & Fournier ne sait pas où en sont les demandes
de SAV. Chaque demande est confiée à un technicien et relue par une autre personne avant
d’être terminée.

## Recette client
1. Ouvrir une demande en cours en choisissant « Vous êtes : assigné » : cliquer
   « Envoyer en revue », le statut devient « en revue ».
2. La même demande en « autre membre » : le bouton « Terminer » est présent.
3. Cliquer « Terminer » : le statut devient « terminée », plus aucun bouton.

## Critères
- R1 Étant donné une demande ouverte sans technicien assigné, quel que soit l’acteur,
  alors le bouton « Démarrer » est absent et le message « Assignez la demande avant de
  la démarrer. » est affiché.
- R2 Étant donné une demande en cours dont le relecteur est le technicien assigné, quand
  l’assigné consulte la page, alors le bouton « Envoyer en revue » est absent et le message
  « Le relecteur doit être une autre personne. » est affiché.
- R3 Étant donné une demande en revue dont le technicien a fini, alors tout membre de
  l’équipe peut la terminer.
- R4 Étant donné une demande en revue, quand le relecteur la renvoie, alors elle repasse
  en cours.
- R5 Étant donné une demande terminée ou abandonnée, alors aucun bouton de transition
  n’est affiché.

## Hors périmètre
Abandon avec motif (RL-13), urgence, courriel au client, historique, export.

## Données traitées
Aucune donnée personnelle de client final. Prénoms fictifs des membres de l’équipe.

## Questions ouvertes
Aucune.

## Réponses
Aucune.
