import { test, expect } from '@playwright/test';

test('seed', async ({ page }) => {
  await page.goto('/demandes');
  await expect(page.getByRole('heading', { name: 'Demandes de SAV' })).toBeVisible();
});
