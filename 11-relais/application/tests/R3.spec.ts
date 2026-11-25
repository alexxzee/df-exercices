import { test, expect } from '@playwright/test';

test.describe('RL-12', () => {
  test('R3 seul le relecteur termine une demande en revue', async ({ page }) => {
    for (const acteur of ['autre', 'assigne']) {
      await page.goto(`/demandes/D-104?acteur=${acteur}`);
      await expect(page.getByTestId('statut')).toHaveText('en revue');
      await expect(page.getByRole('button', { name: 'Terminer' })).toHaveCount(0);

      const reponse = await page.request.post('/demandes/D-104/transition', {
        form: { acteur, transition: 'terminer' },
        maxRedirects: 0,
      });
      expect(reponse.status()).toBe(403);
      expect(await reponse.text()).toBe('Action refusée.');
    }

    await page.goto('/demandes/D-104?acteur=relecteur');
    await expect(page.getByRole('button', { name: 'Terminer' })).toBeVisible();
  });
});
