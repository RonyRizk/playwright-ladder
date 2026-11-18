// Tasky: a tiny to-do app. One user, data kept in memory.
const express = require('express');
const crypto = require('node:crypto');
const path = require('node:path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const USERS = { ada: 'secret123' };

// Every login gets its own private list, so it always starts the same way.
const sessions = new Map(); // cookie value -> { username, nextId, todos }

function starterTodos() {
  return [
    { id: 1, title: 'Join the session', done: true },
    { id: 2, title: 'Learn Playwright', done: false },
    { id: 3, title: 'Write my first test', done: false },
  ];
}

function requireLogin(req, res, next) {
  const match = /(?:^|;\s*)session=([^;]+)/.exec(req.headers.cookie || '');
  req.session = match ? sessions.get(match[1]) : undefined;
  if (!req.session) return res.status(401).json({ error: 'Please log in first' });
  next();
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  // Real servers are slow. We pretend the database needs 0.6 seconds.
  setTimeout(() => {
    if (!username || USERS[username] !== password) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }
    const token = crypto.randomUUID();
    sessions.set(token, { username, nextId: 4, todos: starterTodos() });
    res.cookie('session', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ username });
  }, 600);
});

app.post('/api/logout', requireLogin, (req, res) => {
  res.clearCookie('session');
  res.json({ ok: true });
});

app.get('/api/me', requireLogin, (req, res) => res.json({ username: req.session.username }));

app.get('/api/todos', requireLogin, (req, res) => res.json(req.session.todos));

app.post('/api/todos', requireLogin, (req, res) => {
  const title = String((req.body || {}).title || '').trim();
  if (!title) return res.status(400).json({ error: 'A task needs a title' });
  const todo = { id: req.session.nextId++, title, done: false };
  req.session.todos.push(todo);
  res.status(201).json(todo);
});

app.patch('/api/todos/:id', requireLogin, (req, res) => {
  const todo = req.session.todos.find((t) => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'No such task' });
  todo.done = Boolean((req.body || {}).done);
  res.json(todo);
});

app.delete('/api/todos/:id', requireLogin, (req, res) => {
  req.session.todos = req.session.todos.filter((t) => t.id !== Number(req.params.id));
  res.status(204).end();
});

// For tests only: put the list back to its starting state.
app.post('/api/reset', requireLogin, (req, res) => {
  req.session.todos = starterTodos();
  req.session.nextId = 4;
  res.json({ ok: true });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Tasky is running on http://localhost:${port}`));
