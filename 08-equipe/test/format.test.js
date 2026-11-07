'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const { formaterEuros } = require('../src/utils/format');

test('formaterEuros écrit le montant à la française', () => {
  assert.equal(formaterEuros(1234.5), '1 234,50 €');
});

test('formaterEuros garde deux décimales', () => {
  assert.equal(formaterEuros(90), '90,00 €');
});
