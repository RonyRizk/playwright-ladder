const { test, expect } = require('@playwright/test');

// page.route() catches a request BEFORE it leaves the browser and lets us answer it.

test('shows a friendly message when there are no tasks', async ({ page }) => {
  await page.route('**/api/todos', (route) => route.fulfill({ json: [] }));
  await page.goto('/');
  await expect(page.getByText('Nothing to do. Enjoy your day!')).toBeVisible();
  await expect(page.getByTestId('counter')).toHaveText('0 tasks left');
});

test('shows an error when the server is broken', async ({ page }) => {
  await page.route('**/api/todos', (route) =>
    route.fulfill({ status: 500, json: { error: 'The database is on fire' } })
  );
  await page.goto('/');
  await expect(page.getByRole('alert')).toHaveText('Could not load your tasks. Try again later.');
});

test('shows tasks the server never had', async ({ page }) => {
  await page.route('**/api/todos', (route) =>
    route.fulfill({
      json: [
        { id: 1, title: 'Walk on the moon', done: false },
        { id: 2, title: 'Win a Nobel prize', done: true },
        { id: 3, title: 'Teach a robot to click', done: false },
      ],
    })
  );
  await page.goto('/');
  await expect(page.getByRole('listitem')).toHaveCount(3);
  await expect(page.getByTestId('counter')).toHaveText('2 tasks left');
});
