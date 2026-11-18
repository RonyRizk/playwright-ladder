// Playwright's settings file. It is read every time you run "npx playwright test".
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // WHERE the test files are.
  testDir: './tests',
  // HOW MANY tests run at the same time. 1 = one after the other.
  workers: 1,
  // On the CI robot, refuse to run if someone forgot a "test.only" in a file.
  forbidOnly: !!process.env.CI,
  // HOW results are shown: one line per test in the terminal, plus a web page report.
  // On your laptop the report opens by itself when a test fails. On CI it never opens.
  reporter: [['list'], ['html', { open: process.env.CI ? 'never' : 'on-failure' }]],
  // How long a check (expect) keeps trying before it fails: 5 seconds.
  expect: { timeout: 5000 },

  // Settings given to the browser of EVERY test.
  use: {
    // The address of the app, so a test can simply write goto('/').
    baseURL: 'http://localhost:3000',
    // How long a click or a fill waits for its element: 5 seconds.
    actionTimeout: 5000,
    // When a test fails, keep a step-by-step recording (the trace) and a picture.
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    launchOptions: {
      // Optional slow motion: "set SLOWMO=700" pauses 0.7 seconds between actions.
      slowMo: Number(process.env.SLOWMO || 0),
      // Two monitors? Choose where a visible browser opens: set WINDOW_POS=-1500,60
      args: process.env.WINDOW_POS ? ['--window-position=' + process.env.WINDOW_POS] : [],
    },
  },

  // Named groups of tests, each with its own settings.
  projects: [
    // 1) Runs first: logs in once and saves the cookie to a file.
    { name: 'setup', testMatch: /.*\.setup\.js/ },
    // 2) Every other test starts already logged in.
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
      dependencies: ['setup'],
    },
  ],

  // The app under test: Playwright starts it, waits until it answers, and stops it at the end.
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000/health',
    // On your laptop: if the app is already running, use that one. On CI: always start a fresh one.
    reuseExistingServer: !process.env.CI,
  },
});