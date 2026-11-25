#!/usr/bin/env bash
# Controle des regles de Relais, lance par Claude Code a chaque fin de tour (hook Stop).
# Lancement a la main, depuis application/ :
#   echo '{"stop_hook_active":false}' | .claude/hooks/verifier-regles.sh; echo $?
# Code 0 : l'agent peut s'arreter. Code 2 : fin refusee, le message part a l'agent.
set -u
cd "$(dirname "$0")/../.." || exit 1
if [ ! -x vendor/bin/phpunit ]; then
  echo "Contrôle des règles : vendor/bin/phpunit introuvable, lancez composer install dans application/." >&2
  exit 1
fi

entree="$(cat)"
deja_relance=non
if printf '%s' "$entree" | grep -Eq '"stop_hook_active"[[:space:]]*:[[:space:]]*true'; then
  deja_relance=oui
fi

sortie="$(vendor/bin/phpunit tests/regles --colors=never --no-progress 2>&1)"
if [ $? -eq 0 ]; then
  exit 0
fi

if [ "$deja_relance" = oui ]; then
  printf '%s\n' '{"systemMessage": "R3 toujours rouge après une relance : arrêt laissé à la personne. Lancez vendor/bin/phpunit tests/regles."}'
  exit 0
fi

{
  echo "Fin refusée par le contrôle des règles de Relais."
  echo "R3 (RL-12, décision du client du 18/11) : seul le relecteur termine ou renvoie une demande en revue."
  echo "Le code actuel le permet à un autre acteur. Corrige src/Relais/Transitions.php, pas le test."
  echo "Si tu as modifié un test e2e pour accepter ce comportement, remets-le comme il était et signale une régression."
  echo
  printf '%s\n' "$sortie" | grep -A5 -m1 -E '^[0-9]+\) '
} >&2
exit 2
