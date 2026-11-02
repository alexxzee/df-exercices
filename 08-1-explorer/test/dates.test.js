'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { ajouterJoursOuvres, finDeMois, formaterDate } = require('../src/utils/dates');

test('saute le week-end', () => {
  assert.equal(formaterDate(ajouterJoursOuvres(new Date('2026-10-30T00:00:00Z'), 2)), '2026-11-03');
});

test('donne le dernier jour du mois', () => {
  assert.equal(formaterDate(finDeMois(new Date('2026-02-10T00:00:00Z'))), '2026-02-28');
});
