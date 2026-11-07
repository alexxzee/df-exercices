// Fichier de la formation : ne pas modifier.
// Vérifie le découpage de l'agent testeur en agent, skill et documentation.
// Usage (depuis le sous-dossier de l'exercice) : npm run verifier-architecture
// L'agent de votre outil suffit : un seul des trois formats a besoin d'être découpé.
// Aucun fichier n'est modifié.
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const exercice = process.argv[2];
if (!exercice) {
  console.error('Usage : node ../outils/verifier-architecture.js <dossier-exercice>');
  process.exit(2);
}
const dossier = path.join(__dirname, '..', exercice);

const AGENTS = ['.github/agents/testeur.agent.md', '.claude/agents/testeur.md', '.codex/agents/testeur.toml'];
const SKILLS = [
  '.github/skills/tester-une-route/SKILL.md',
  '.agents/skills/tester-une-route/SKILL.md',
  '.claude/skills/tester-une-route/SKILL.md',
];
const DOCUMENTATION = 'docs/tests-du-projet.md';

// Repères tirés de l'agent fourni : quelques lignes de chaque partie suffisent à la reconnaître.
const METIER = ['jamais du code testé', 'ne modifie jamais un fichier de src/'];
const METHODE = [
  'recopie-la en commentaire au-dessus du test',
  'la valeur juste avant, sur le seuil, juste après',
  'sans serveur ni port',
  "vérifie d'abord le statut, puis le type de contenu, puis le corps",
  'construis le jeu de données dans le test',
  'à la suite des tests existants',
  "forme d'un test de route",
];
const FAITS = [
  'habitat concept 69',
  'menuiserie garnier',
  'clients 1 et 7 seulement',
  'appelerroute(chemin, donnees)',
  'attendreerreur(reponse, statut, message)',
  '&amp;',
  "aucun devis de démonstration n'est daté d'aujourd'hui",
  '3 180,00 €',
];
const SEUIL_METHODE = 5;
const SEUIL_FAITS = 6;

function normaliser(texte) {
  return texte.toLowerCase().replace(/[‘’]/g, "'").replace(/[  ]/g, ' ').replace(/`/g, '').replace(/\s+/g, ' ');
}

function lire(chemin) {
  try {
    return fs.readFileSync(path.join(dossier, chemin), 'utf8');
  } catch {
    return null;
  }
}

function compter(texte, reperes) {
  const propre = normaliser(texte);
  return reperes.filter((repere) => propre.includes(normaliser(repere))).length;
}

function ouiNon(valeur) {
  return valeur ? 'oui' : 'non';
}

const controles = [];
function controler(libelle, reussi, precision) {
  controles.push(reussi);
  console.log('  ' + libelle + ' : ' + ouiNon(reussi) + (precision && !reussi ? ' (' + precision + ')' : ''));
}

// 1. L'agent : on retient, parmi les trois formats, celui qui est le plus avancé.
const agents = AGENTS.map((chemin) => {
  const texte = lire(chemin);
  if (texte === null) return null;
  const etat = {
    chemin,
    metier: compter(texte, METIER) === METIER.length,
    sansMethode: compter(texte, METHODE) === 0,
    sansFaits: compter(texte, FAITS) === 0,
    nommeSkill: normaliser(texte).includes('tester-une-route'),
    nommeDocumentation: normaliser(texte).includes('tests-du-projet.md'),
  };
  etat.score = [etat.metier, etat.sansMethode, etat.sansFaits, etat.nommeSkill, etat.nommeDocumentation].filter(
    Boolean,
  ).length;
  return etat;
}).filter(Boolean);

if (agents.length === 0) {
  console.log('Aucun fichier de l’agent testeur trouvé (' + AGENTS.join(', ') + ').');
  console.log('Vérifiez que le terminal est ouvert dans le dossier de l’exercice, puis relancez.');
  process.exit(1);
}
const agent = agents.reduce((meilleur, etat) => (etat.score > meilleur.score ? etat : meilleur));

console.log('Architecture de l’agent testeur');
console.log('  Agent lu : ' + agent.chemin);
controler('Agent, métier et interdits gardés', agent.metier, 'des lignes de la partie 1 manquent');
controler('Agent, méthode retirée', agent.sansMethode, 'des lignes de la méthode y sont encore');
controler('Agent, faits du projet retirés', agent.sansFaits, 'des faits du projet y sont encore');
controler('Agent, nomme le skill tester-une-route', agent.nommeSkill);
controler('Agent, nomme ' + DOCUMENTATION, agent.nommeDocumentation);

// 2. Le skill : l'un des trois dossiers suffit.
const skills = SKILLS.map((chemin) => {
  const texte = lire(chemin);
  return texte === null ? null : { chemin, texte, methode: compter(texte, METHODE) };
}).filter(Boolean);
const skill = skills.reduce((meilleur, etat) => (!meilleur || etat.methode > meilleur.methode ? etat : meilleur), null);
controler(
  'Skill tester-une-route, contient la méthode',
  skill !== null && skill.methode >= SEUIL_METHODE,
  skill === null ? 'aucun SKILL.md trouvé' : skill.methode === 0 ? 'corps encore vide' : 'une partie seulement',
);
if (skill !== null) {
  const description = (skill.texte.match(/^description:\s*(.*)$/m) || [null, ''])[1].trim();
  console.log('  Skill lu : ' + skill.chemin + ', description « ' + description + ' »');
}

// 3. La documentation.
const documentation = lire(DOCUMENTATION);
const faits = documentation === null ? 0 : compter(documentation, FAITS);
controler(
  DOCUMENTATION + ', contient les faits du projet',
  faits >= SEUIL_FAITS,
  documentation === null ? 'fichier absent' : faits === 0 ? 'encore vide' : 'une partie seulement',
);

// 4. Signe de lecture : un test de GET /clients/99 écrit avec l'aide de test/aide.js.
function fichiersDeTest(relatif) {
  const absolu = path.join(dossier, relatif);
  if (!fs.existsSync(absolu)) return [];
  return fs.readdirSync(absolu, { withFileTypes: true }).flatMap((entree) => {
    const chemin = path.posix.join(relatif, entree.name);
    if (entree.isDirectory()) return fichiersDeTest(chemin);
    return entree.name.endsWith('.js') && chemin !== 'test/aide.js' ? [chemin] : [];
  });
}
const avecTest = fichiersDeTest('test').filter((chemin) => /\/clients\/99(?!\d)/.test(lire(chemin)));
if (avecTest.length === 0) {
  console.log('Test de GET /clients/99 : pas encore écrit');
} else {
  for (const chemin of avecTest) {
    const texte = lire(chemin);
    const avecAide =
      /require\(\s*['"]\.\/aide(\.js)?['"]\s*\)/.test(texte) && /\b(appelerRoute|attendreErreur)\s*\(/.test(texte);
    console.log(
      'Test de GET /clients/99 : écrit dans ' +
        chemin +
        (avecAide ? ', avec l’aide de test/aide.js' : ', sans l’aide de test/aide.js'),
    );
  }
}

const reussis = controles.filter(Boolean).length;
console.log(
  reussis === controles.length
    ? 'Bilan : découpage conforme, les ' + controles.length + ' contrôles réussissent.'
    : 'Bilan : ' +
        reussis +
        (reussis > 1 ? ' contrôles réussis' : ' contrôle réussi') +
        ' sur ' +
        controles.length +
        '.',
);
process.exitCode = reussis === controles.length ? 0 : 1;
