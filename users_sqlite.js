//! підключаєм конфіг по назві пакеджа, а не по конкретному файлу :)
//! ну, і про структуру свого конфіга теж не забуваєм )
const { server } = require('config');

const knexLib = require('knex');
const knexConfig = require('./knexfile');
const knex = knexLib(knexConfig);

const express = require('express');
const app = express();

app.use(express.json());

app.post('/users', validateUserData, async (req, resp) => {
  const { username, email } = req.body;
  try {
    const [userId] = await knex('users').insert({ username, email });
    const newUser = { id: userId, username, email };
    resp.status(201).json(newUser);
  } catch (error) {
    resp.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/users', async (req, resp) => {
  try {
    const users = await knex('users').select('*');
    resp.json(users);
  } catch (error) {
    resp.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.get('/users/:userId', async (req, resp) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId) || userId < 0 || userId % 1 !== 0) {
    return resp.status(400).json({ error: 'Invalid userId.' });
  }
  try {
    const user = await knex('users').where('id', userId).first();
    if (!user) {
      return resp.status(404).json({ error: 'User not found' });
    }
    resp.json(user);
  } catch (error) {
    resp.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.delete('/users/:userId', async (req, resp) => {
  const userId = parseInt(req.params.userId);
  if (isNaN(userId) || userId < 0 || userId % 1 !== 0) {
    return resp.status(400).json({ error: 'Invalid userId.' });
  }
  try {
    const deletedCount = await knex('users').where('id', userId).del();
    if (deletedCount === 0) {
      return resp.status(404).json({ error: 'User not found' });
    }
    resp.status(204).send();
  } catch (error) {
    resp.status(500).json({ error: 'Failed to delete user' });
  }
});

function validateUserData(req, resp, next) {
  const { username, email } = req.body;
  if (!username || !email) {
    return resp.status(400).json({ error: 'Both username and email are required' });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return resp.status(400).json({ error: 'Invalid email' });
  }
  next();
}

app.listen(server.port, () => {
  console.log('Server is running on port', server.port);
});