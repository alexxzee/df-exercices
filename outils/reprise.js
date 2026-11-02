// Fichier de la formation : ne pas modifier.
// Pose l'état prêt d'une partie d'exercice, pour rattraper un retard.
// Usage (depuis le sous-dossier de l'exercice) : npm run reprise -- <partie>
// Votre travail actuel est d'abord copié dans .sauvegardes/ à la racine du dépôt.
// L'historique git n'est pas modifié : aucun commit, aucune branche.
// Un exercice qui porte son propre dépôt git (06-integrer, envoyé sur le compte
// du participant) garde son dossier .git : les fichiers de la partie sont lus
// dans le dépôt df-exercices et écrits sans passer par le dépôt de l'exercice.
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const DEPOT_CORRIGES = 'https://github.com/alexxzee/df-exercices-reprises.git';
const PARTIES = {
  '01-date-livraison': ['3', '5'],
  '02-1-tests-depuis-la-spec': ['4', '5', '7'],
  '03-refactoriser': ['3', '4', '5'],
  '04-auditer': ['3', '5', '6'],
  '05-proteger': ['4', '7'],
  '06-integrer': ['3', '5', '6'],
  '08-1-explorer': ['3'],
  '08-2-equipe': ['4'],
  intersession: ['2'],
};
// Fichiers que vous remplissez d'un bout à l'autre de l'exercice : la reprise
// les laisse tels quels (08-1-explorer : la colonne « Essai 1 » de la grille).
const CONSERVES = {
  '08-1-explorer': ['COMPARAISON.md'],
};

const exercice = process.argv[2];
const partie = process.argv[3];
const parties = PARTIES[exercice];

function arreter(message) {
  console.error(message);
  process.exit(1);
}

if (!parties) arreter('Exercice inconnu : ' + exercice);
if (!parties.includes(partie)) {
  arreter('Indiquez la partie à poser : npm run reprise -- <partie>, avec <partie> parmi ' + parties.join(', ') + '.');
}

const dossierExercice = path.join(__dirname, '..', exercice);
// Seuls les fichiers conservés encore présents sont gardés ; un fichier absent est reposé.
const conserves = (CONSERVES[exercice] || []).filter((nom) => fs.existsSync(path.join(dossierExercice, nom)));

// Dépôt propre à l'exercice : git travaille depuis la racine de df-exercices,
// jamais dans le dépôt de l'exercice.
const depotInterieur = fs.existsSync(path.join(dossierExercice, '.git'));
const dossierGit = depotInterieur ? path.join(__dirname, '..') : dossierExercice;

function git(args, encodage = 'utf8') {
  return spawnSync('git', args, { cwd: dossierGit, encoding: encodage, maxBuffer: 64 * 1024 * 1024 });
}

const racineGit = git(['rev-parse', '--show-toplevel']);
if (racineGit.status !== 0) {
  arreter('Ce dossier n’est pas dans un clone git de df-exercices : clonez le dépôt avec git clone --depth 1 (voir le README).');
}
const racine = racineGit.stdout.trim();

// Préfixe numérique du dossier : 01-date-livraison donne 01, 02-1-tests-depuis-la-spec donne 02-1.
// Un dossier sans numéro (intersession) garde son nom entier.
const prefixe = (exercice.match(/^\d+(-\d+)?(?=-)/) || [exercice])[0];
const branche = prefixe + '/partie-' + partie;
console.log('Récupération de la partie ' + partie + ' (' + branche + ')…');
// --depth 1 : seul l'état de la partie est récupéré, sans l'historique du dépôt des reprises.
const recuperation = git(['fetch', '--quiet', '--depth', '1', '--no-tags', DEPOT_CORRIGES, branche]);
if (recuperation.status !== 0) {
  arreter('Récupération impossible. Vérifiez la connexion à GitHub, puis relancez.\n' + recuperation.stderr.trim());
}
if (git(['cat-file', '-e', 'FETCH_HEAD:' + exercice]).status !== 0) {
  arreter('La partie ' + partie + ' ne contient pas le dossier ' + exercice + '. Prévenez le formateur.');
}

// 1. Copie de sauvegarde du travail actuel (sans node_modules).
const horodatage = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
const sauvegarde = path.join(racine, '.sauvegardes', exercice + '-' + horodatage);
fs.cpSync(dossierExercice, sauvegarde, {
  recursive: true,
  filter: (source) => !/[\\/]node_modules([\\/]|$)/.test(source),
});

// 2. On vide le dossier de l'exercice (le dossier lui-même reste, il est ouvert dans l'éditeur).
for (const nom of fs.readdirSync(dossierExercice)) {
  // .env, ignoré par git, porte vos réglages locaux : il reste en place.
  // .git, s'il existe, est le dépôt de l'exercice : il reste en place.
  if (nom === 'node_modules' || nom === '.env' || nom === '.git' || conserves.includes(nom)) continue;
  fs.rmSync(path.join(dossierExercice, nom), { recursive: true, force: true });
}

// 3. On pose les fichiers de la partie, sans toucher à l'historique.
if (depotInterieur) {
  const liste = git(['ls-tree', '-r', '-z', 'FETCH_HEAD', '--', exercice + '/']);
  if (liste.status !== 0) {
    arreter('Pose impossible : ' + liste.stderr.trim() + '\nVotre travail est intact dans ' + sauvegarde);
  }
  for (const entree of liste.stdout.split('\0').filter(Boolean)) {
    const [entete, chemin] = entree.split('\t');
    const [mode, type, objet] = entete.split(' ');
    if (type !== 'blob' || conserves.includes(path.relative(exercice, chemin))) continue;
    const contenu = git(['cat-file', 'blob', objet], 'buffer');
    if (contenu.status !== 0) {
      arreter('Pose impossible : ' + chemin + '\nVotre travail est intact dans ' + sauvegarde);
    }
    const cible = path.join(racine, chemin);
    fs.mkdirSync(path.dirname(cible), { recursive: true });
    fs.writeFileSync(cible, contenu.stdout, { mode: mode === '100755' ? 0o755 : 0o644 });
  }
} else {
  const exclusions = conserves.map((nom) => ':(exclude)' + nom);
  const pose = git(['checkout', 'FETCH_HEAD', '--', '.', ...exclusions]);
  if (pose.status !== 0) {
    arreter('Pose impossible : ' + pose.stderr.trim() + '\nVotre travail est intact dans ' + sauvegarde);
  }
  git(['reset', '--quiet', '--', '.']);
}

console.log('Partie ' + partie + ' posée dans ' + exercice + '/.');
console.log('Votre travail précédent est copié dans ' + path.relative(racine, sauvegarde) + '/.');
for (const nom of conserves) console.log(nom + ' est gardé tel que vous l’avez rempli.');
console.log(exercice === '04-auditer' ? 'Vérifiez : git status --short' : 'Vérifiez : npm test');
if (depotInterieur) {
  console.log('Votre dépôt n’a pas bougé : vérifiez les fichiers posés (git status), puis commitez et envoyez vous-même.');
}
