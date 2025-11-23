import { test, expect } from '@playwright/test';

const tools = [
  { slug: 'calculateur-tantiemes-copro', field: 'textarea' },
  { slug: 'convocation-ag-copro', field: 'input' },
  { slug: 'quittance-colocation', field: 'input' }
];

test.describe('outils SEO', () => {
  for (const tool of tools) {
    test(`affiche ${tool.slug}`, async ({ page }) => {
      await page.goto(`/outil/${tool.slug}`);
      await expect(page.getByText(/Exporter/)).toBeVisible();
      await expect(page.getByRole(tool.field === 'textarea' ? 'textbox' : 'textbox').first()).toBeVisible();
      await page.getByText('Essayer gratuitement').click();
      await expect(page).toHaveURL(/signup/);
    });
  }
});
