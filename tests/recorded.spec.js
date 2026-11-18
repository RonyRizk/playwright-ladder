import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await page.getByRole('textbox', { name: 'Username' }).click();
  await page.getByRole('textbox', { name: 'Username' }).fill('ada');
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('secret123');
  await page.getByRole('button', { name: 'Log in' }).click();
  await page.getByRole('textbox', { name: 'New task' }).click();
  await page.getByRole('textbox', { name: 'New task' }).fill('Record a test');
  await page.getByRole('button', { name: 'Add' }).click();
  await page.locator('label').filter({ hasText: 'Record a test' }).click();
  await page.getByRole('checkbox', { name: 'Record a test' }).check();
  await expect(page.getByTestId('counter')).toContainText('2 tasks left');
});