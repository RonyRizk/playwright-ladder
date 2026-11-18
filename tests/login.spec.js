const { test, expect } = require('@playwright/test');

// These tests are about the login form, so they must start logged OUT.
test.use({ storageState: { cookies: [], origins: [] } });

test('shows the login page', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Tasky');
  await expect(page.getByRole('heading', { name: 'Welcome to Tasky' })).toBeVisible();
});

test('rejects a wrong password', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('ada');
  await page.getByLabel('Password').fill('not-my-password');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('alert')).toHaveText('Wrong username or password');
});

test('logs in with the right password', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('ada');
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page.getByRole('heading', { name: 'My tasks' })).toBeVisible();
  await expect(page.getByText('Hello, ada')).toBeVisible();
});