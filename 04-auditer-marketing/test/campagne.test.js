'use strict';

const assert = require('node:assert/strict');
const path = require('node:path');
const { test } = require('node:test');
const { ouvrirBase, importer, destinataires, desinscrire, remplir } = require('../campagne.js');

const CONTACTS = path.join(__dirname, '..', 'data', 'import-salon.csv');

function baseDeTest() {
  const base = ouvrirBase(':memory:');
  importer(base, CONTACTS);
  return base;
}

function adresses(base) {
  return destinataires(base, 'salon').map((contact) => contact.email);
}

test('importer charge les contacts dans le segment demandé', () => {
  const base = ouvrirBase(':memory:');
  assert.equal(importer(base, CONTACTS), 6);
  assert.ok(adresses(base).includes('lina.roche@exemple.invalid'));
  assert.deepEqual(destinataires(base, 'autre-segment'), []);
});

test('un contact qui a répondu non ne reçoit rien', () => {
  assert.ok(!adresses(baseDeTest()).includes('marc.petit@exemple.invalid'));
});

test('desinscrire retire le contact de la liste', () => {
  const base = baseDeTest();
  desinscrire(base, 'nora.vidal@exemple.invalid');
  const restants = adresses(base);
  assert.ok(!restants.includes('nora.vidal@exemple.invalid'));
  assert.ok(restants.includes('paul.girard@exemple.invalid'));
});

test('remplir personnalise le message', () => {
  const message = remplir(
    'Bonjour ${contact.prenom}, voir ${liens.boutique}',
    { prenom: 'Lina' },
    { boutique: 'https://www.brindille.invalid/printemps' },
  );
  assert.equal(message, 'Bonjour Lina, voir https://www.brindille.invalid/printemps');
});
