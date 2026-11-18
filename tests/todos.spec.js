const { test, expect } = require('@playwright/test');

// Runs before EVERY test below: open the app and log in.
test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Username').fill('ada');
  await page.getByLabel('Password').fill('secret123');
  await page.getByRole('button', { name: 'Log in' }).click();
});

test('starts with two tasks left', async ({ page }) => {
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByTestId('counter')).toHaveText('2 tasks left');
});

test('adds a task', async ({ page }) => {
  await page.getByLabel('New task').fill('Buy milk');
  await page.getByRole('button', { name: 'Add', exact: true }).click();
  await expect(page.getByRole('listitem').filter({ hasText: 'Buy milk' })).toBeVisible();
  await expect(page.getByTestId('counter')).toHaveText('3 tasks left');
});

test('completes a task', async ({ page }) => {
  await page.getByRole('checkbox', { name: 'Learn Playwright' }).check();
  await expect(page.getByRole('listitem').filter({ hasText: 'Learn Playwright' })).toHaveClass(/done/);
  await expect(page.getByTestId('counter')).toHaveText('1 task left');
});

test('deletes a task', async ({ page }) => {
  await page.getByRole('button', { name: 'Delete Learn Playwright' }).click();
  await expect(page.getByRole('listitem')).toHaveCount(2);
});
