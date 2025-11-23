import { test, expect } from '@playwright/test';

test('landing to demo navigation', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('La solution SaaS')).toBeVisible();
  await page.getByRole('link', { name: 'Essayer la démo' }).click();
  await expect(page).toHaveURL(/.*demo/);
  await expect(page.getByText('Démo en lecture seule')).toBeVisible();
});
