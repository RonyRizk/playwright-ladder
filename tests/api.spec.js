const { test, expect } = require('@playwright/test');

// No browser window in most of these tests: "request" talks to the API directly.
test.beforeEach(async ({ request }) => {
  await request.post('/api/reset');
});

test('GET /health says the API is ok', async ({ request }) => {
  const res = await request.get('/health');
  expect(res.status()).toBe(200);
  expect(await res.json()).toEqual({ status: 'ok' });
});

test('POST /api/todos creates a task', async ({ request }) => {
  const res = await request.post('/api/todos', { data: { title: 'Made by a robot' } });
  expect(res.status()).toBe(201);
  expect(await res.json()).toMatchObject({ title: 'Made by a robot', done: false });

  const list = await (await request.get('/api/todos')).json();
  expect(list).toHaveLength(4);
});

test('POST /api/todos rejects an empty title', async ({ request }) => {
  const res = await request.post('/api/todos', { data: { title: '   ' } });
  expect(res.status()).toBe(400);
});

test('the API sets it up, the screen proves it', async ({ request, page }) => {
  await request.post('/api/todos', { data: { title: 'Made by a robot' } });
  await page.goto('/');
  await expect(page.getByRole('listitem').filter({ hasText: 'Made by a robot' })).toBeVisible();
});

test.describe('without a login', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('the API refuses strangers', async ({ request }) => {
    const res = await request.get('/api/todos');
    expect(res.status()).toBe(401);
  });
});
