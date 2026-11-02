// Fichier de la formation : ne pas modifier.
'use strict';

// Hook « avant l'action » commun à Copilot, Codex et Claude Code.
//   node hooks/garde-secrets.js <chemin protégé> [<autre chemin protégé> ...]
// L'outil d'IA lance cette commande avant chaque action de son agent et lui
// passe l'action en JSON sur l'entrée standard. Si l'action lit, écrit ou cite
// un chemin protégé (outil de fichier ou commande du terminal), le script la
// refuse : code de sortie 2 et motif sur la sortie d'erreur, plus la même
// décision en JSON sur la sortie standard pour les outils qui la lisent.
// Toute autre action passe (code 0), y compris une entrée illisible : choix de
// la formation, pour ne jamais bloquer un outil dont le format changerait.
// Aucun chemin n'est écrit ici : ils sont donnés en argument.

const fs = require('node:fs');
const path = require('node:path');

const RACINE = path.resolve(__dirname, '..');

function lireEvenement() {
  try {
    const evenement = JSON.parse(fs.readFileSync(0, 'utf8'));
    return evenement && typeof evenement === 'object' ? evenement : null;
  } catch {
    return null;
  }
}

// Copilot passe parfois les arguments sous forme de texte JSON.
function argumentsDe(evenement) {
  const args = evenement.tool_input ?? evenement.toolArgs ?? evenement.toolInput ?? {};
  if (typeof args !== 'string') return args;
  try {
    return JSON.parse(args);
  } catch {
    return args;
  }
}

function textes(valeur, sortie = []) {
  if (typeof valeur === 'string') sortie.push(valeur);
  else if (Array.isArray(valeur)) valeur.forEach((v) => textes(v, sortie));
  else if (valeur && typeof valeur === 'object') Object.values(valeur).forEach((v) => textes(v, sortie));
  return sortie;
}

function normaliser(texte) {
  const racine = RACINE.split(path.sep).join('/');
  return texte.split('\\').join('/').split(`${racine}/`).join('');
}

function echapper(texte) {
  return texte.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Le chemin protégé, isolé : précédé d'un début, d'un blanc, d'une barre,
// d'un guillemet, de « = », « : », « < », « > » ou « ( », et suivi d'aucun
// caractère de nom de fichier (.env.example n'est donc pas visé par .env).
function vise(texte, chemin) {
  const motif = new RegExp(`(^|[\\s"'=:<>(/])${echapper(chemin)}(?![\\w.-])`);
  return motif.test(normaliser(texte));
}

function cheminVise(evenement, proteges) {
  const morceaux = textes(argumentsDe(evenement));
  return proteges.find((chemin) => morceaux.some((texte) => vise(texte, chemin))) ?? null;
}

function principal() {
  const proteges = process.argv.slice(2).map((c) => c.split('\\').join('/').replace(/^\.\//, ''));
  const evenement = lireEvenement();
  if (proteges.length === 0 || evenement === null) return 0;
  const chemin = cheminVise(evenement, proteges);
  if (chemin === null) return 0;
  const motif = `Refusé par le hook garde-secrets : ${chemin} contient des secrets, aucun agent ne le lit ni ne le modifie. Demandez à l’utilisateur ce dont vous avez besoin, sans la valeur.`;
  process.stdout.write(`${JSON.stringify({
    permissionDecision: 'deny',
    permissionDecisionReason: motif,
    hookSpecificOutput: { hookEventName: 'PreToolUse', permissionDecision: 'deny', permissionDecisionReason: motif },
  })}\n`);
  process.stderr.write(`${motif}\n`);
  return 2;
}

if (require.main === module) process.exit(principal());

module.exports = { cheminVise, vise };
