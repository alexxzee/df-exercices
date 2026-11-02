// Fichier de la formation : ne pas modifier.
'use strict';

// Vérifie le hook de l'atelier 05-proteger, sans l'agent : lit la configuration
// de chaque outil dans le sous-dossier ouvert, lance la commande déclarée avec
// trois actions simulées au format de l'outil, et dit si chacune est refusée ou
// acceptée.
//   npm run hook
// Attendu : lire .env est refusé, par l'outil de lecture comme par le
// terminal ; lire src/remises.js est accepté.
// Ce contrôle prouve que la commande refuse ; il ne prouve pas que l'outil la
// lance (réglage, approbation ou relance propre à chaque outil).

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const PROTEGE = '.env';
const AUTRE = 'src/remises.js';

// Les trois actions simulées, au format de chaque outil.
function evenementsClaude(racine) {
  const base = { session_id: 'simulation', hook_event_name: 'PreToolUse', cwd: racine };
  const lecture = (fichier) => ({ ...base, tool_name: 'Read', tool_input: { file_path: path.join(racine, fichier) } });
  return [
    { action: `lire ${PROTEGE} (outil Read)`, attendu: 'refus', evenement: lecture(PROTEGE) },
    { action: `cat ${PROTEGE} au terminal (outil Bash)`, attendu: 'refus', evenement: { ...base, tool_name: 'Bash', tool_input: { command: `cat ${PROTEGE}` } } },
    { action: `lire ${AUTRE} (outil Read)`, attendu: 'passage', evenement: lecture(AUTRE) },
  ];
}

function evenementsCodex(racine) {
  const base = { session_id: 'simulation', hook_event_name: 'PreToolUse', cwd: racine };
  const terminal = (commande) => ({ ...base, tool_name: 'Bash', tool_input: { command: commande } });
  return [
    { action: `lire ${PROTEGE} (sed -n au terminal, outil Bash)`, attendu: 'refus', evenement: terminal(`sed -n '1,40p' ${PROTEGE}`) },
    { action: `cat ${PROTEGE} au terminal (outil Bash)`, attendu: 'refus', evenement: terminal(`cat ${PROTEGE}`) },
    { action: `lire ${AUTRE} (sed -n au terminal, outil Bash)`, attendu: 'passage', evenement: terminal(`sed -n '1,40p' ${AUTRE}`) },
  ];
}

function evenementsCopilot(racine) {
  const base = { timestamp: 0, cwd: racine };
  const lecture = (fichier) => ({ ...base, toolName: 'view', toolArgs: JSON.stringify({ path: path.join(racine, fichier) }) });
  return [
    { action: `lire ${PROTEGE} (outil view)`, attendu: 'refus', evenement: lecture(PROTEGE) },
    { action: `cat ${PROTEGE} au terminal (outil bash)`, attendu: 'refus', evenement: { ...base, toolName: 'bash', toolArgs: JSON.stringify({ command: `cat ${PROTEGE}` }) } },
    { action: `lire ${AUTRE} (outil view)`, attendu: 'passage', evenement: lecture(AUTRE) },
  ];
}

// Hooks « avant l'action » déclarés, avec leur filtre d'outil (matcher).
function hooksAvecMatcher(config) {
  const groupes = config?.hooks?.PreToolUse;
  if (!Array.isArray(groupes)) return [];
  return groupes.flatMap((groupe) => (Array.isArray(groupe?.hooks) ? groupe.hooks : [])
    .filter((h) => typeof h?.command === 'string')
    .map((h) => ({ matcher: groupe.matcher, command: h.command })));
}

function hooksCopilot(config) {
  const liste = config?.hooks?.preToolUse ?? config?.hooks?.PreToolUse;
  if (!Array.isArray(liste)) return [];
  return liste.flatMap((h) => {
    const command = h?.command ?? h?.bash;
    if (typeof command === 'string') return [{ matcher: undefined, command }];
    return Array.isArray(h?.hooks) ? hooksAvecMatcher({ hooks: { PreToolUse: [h] } }) : [];
  });
}

function fichiersCopilot(racine) {
  const dossier = path.join(racine, '.github', 'hooks');
  if (!fs.existsSync(dossier)) return [];
  return fs.readdirSync(dossier).filter((f) => f.endsWith('.json')).sort().map((f) => `.github/hooks/${f}`);
}

const OUTILS = [
  { nom: 'GitHub Copilot', fichiers: fichiersCopilot, hooks: hooksCopilot, evenements: evenementsCopilot, matcher: false },
  { nom: 'Codex (ChatGPT)', fichiers: () => ['.codex/hooks.json'], hooks: hooksAvecMatcher, evenements: evenementsCodex, matcher: true },
  { nom: 'Claude Code', fichiers: () => ['.claude/settings.json'], hooks: hooksAvecMatcher, evenements: evenementsClaude, matcher: true },
];

function selectionne(matcher, outil) {
  if (matcher === undefined || matcher === null || matcher === '' || matcher === '*') return true;
  try {
    return new RegExp(`^(?:${matcher})$`).test(outil);
  } catch {
    return false;
  }
}

function nomOutil(evenement) {
  return evenement.tool_name ?? evenement.toolName;
}

// Lance une commande de hook comme le ferait l'outil : JSON sur l'entrée standard.
function lancer(command, evenement, racine) {
  const commande = command.replace(/\$\{CLAUDE_PROJECT_DIR\}|\$CLAUDE_PROJECT_DIR\b/g, racine);
  const r = spawnSync(commande, {
    shell: true,
    cwd: racine,
    input: JSON.stringify(evenement),
    encoding: 'utf8',
    timeout: 10000,
    env: { ...process.env, CLAUDE_PROJECT_DIR: racine },
  });
  const lignes = (r.stderr || '').trim().split('\n');
  const erreur = (lignes.find((l) => /Error|Cannot|introuvable/.test(l)) ?? lignes[0]).trim();
  if (r.error || r.status === null) return { issue: 'erreur', motif: 'la commande ne répond pas en 10 secondes' };
  if (r.status === 2) return { issue: 'refus', motif: erreur };
  if (r.status !== 0) return { issue: 'erreur', motif: erreur || `code de sortie ${r.status}` };
  return decisionJson(r.stdout);
}

function decisionJson(sortie) {
  let json;
  try {
    json = JSON.parse(sortie);
  } catch {
    return { issue: 'passage', motif: '' };
  }
  const d = json?.hookSpecificOutput ?? json ?? {};
  if (d.permissionDecision === 'deny') return { issue: 'refus', motif: d.permissionDecisionReason ?? '' };
  return { issue: 'passage', motif: '' };
}

function issueDe(hooks, cas, outil, racine) {
  const actifs = hooks.filter((h) => !outil.matcher || selectionne(h.matcher, nomOutil(cas.evenement)));
  if (actifs.length === 0) return { issue: 'passage', motif: '', ignore: true };
  for (const h of actifs) {
    const r = lancer(h.command, cas.evenement, racine);
    if (r.issue !== 'passage') return r;
  }
  return { issue: 'passage', motif: '' };
}

function lireConfig(racine, fichier) {
  const chemin = path.join(racine, fichier);
  if (!fs.existsSync(chemin)) return { absent: true };
  try {
    return { config: JSON.parse(fs.readFileSync(chemin, 'utf8')) };
  } catch (e) {
    return { invalide: e.message.split('\n')[0] };
  }
}

function libelle(cas, r) {
  if (r.issue === 'erreur') return `   ${cas.action} : le hook plante (${r.motif}). Vérifiez le chemin du script dans « command ».`;
  if (r.ignore) return `   ${cas.action} : accepté, le hook ne se déclenche pas pour cet outil (filtre « matcher »).`;
  if (r.issue === 'refus') return `   ${cas.action} : refusé.${r.motif ? ` Motif : ${r.motif}` : ''}`;
  return `   ${cas.action} : accepté.`;
}

function verifierFichier(outil, fichier, racine, sortie) {
  const lu = lireConfig(racine, fichier);
  if (lu.absent) return;
  if (lu.invalide) {
    sortie.trouves += 1;
    sortie.ok = false;
    sortie.lignes.push(`${outil.nom}, ${fichier} : ce n’est pas du JSON valide (${lu.invalide}).`);
    sortie.lignes.push('   Vérifiez les virgules, les guillemets et les accolades, enregistrez (Ctrl+S), puis relancez.');
    return;
  }
  const hooks = outil.hooks(lu.config);
  if (hooks.length === 0) return;
  sortie.trouves += 1;
  sortie.lignes.push(`${outil.nom}, ${fichier} : ${hooks.length} hook « avant l’action » trouvé${hooks.length > 1 ? 's' : ''}.`);
  for (const cas of outil.evenements(racine)) {
    const r = issueDe(hooks, cas, outil, racine);
    sortie.lignes.push(libelle(cas, r));
    if (r.issue !== (cas.attendu === 'refus' ? 'refus' : 'passage')) sortie.ok = false;
  }
  if (outil.nom.startsWith('Codex')) sortie.lignes.push('   Codex n’exécute ce hook qu’après votre approbation : tapez /hooks dans Codex.');
}

function verifier(racine) {
  const sortie = { lignes: [], ok: true, trouves: 0 };
  for (const outil of OUTILS) {
    for (const fichier of outil.fichiers(racine)) verifierFichier(outil, fichier, racine, sortie);
  }
  if (sortie.trouves === 0) {
    sortie.ok = false;
    sortie.lignes.push('Aucun hook branché : ni .github/hooks/, ni .codex/hooks.json, ni .claude/settings.json ne déclare de hook « avant l’action ».');
    sortie.lignes.push('Collez le bloc de la fiche dans le fichier de votre outil, enregistrez (Ctrl+S), puis relancez.');
    return sortie;
  }
  sortie.lignes.push(sortie.ok
    ? `Bilan : ${PROTEGE} est gardé. Sa lecture est refusée, par l’outil comme par le terminal ; le reste passe.`
    : `Bilan : pas encore. La lecture de ${PROTEGE} doit être refusée, celle de ${AUTRE} acceptée.`);
  return sortie;
}

if (require.main === module) {
  const { lignes, ok } = verifier(process.cwd());
  for (const ligne of lignes) console.log(ligne);
  process.exit(ok ? 0 : 1);
}

module.exports = { verifier, selectionne, decisionJson };
