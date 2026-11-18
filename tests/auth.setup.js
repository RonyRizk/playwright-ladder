const { test: setup, expect } = require('@playwright/test');

const authFile = 'playwright/.auth/user.json';

setup('log in once', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('ada');
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('heading', { name: 'My tasks' })).toBeVisible();

  // Save the cookies of this logged-in browser to a file.
  await page.context().storageState({ path: authFile });
});
