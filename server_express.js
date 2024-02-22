const express = require('express');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const USERS_FILE = './users.json';

let users = [];
try {
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  users = JSON.parse(data);
  console.log('List of users loaded from file:', users);
} catch (err) {
  console.error('Error loading list of users from file:', err);
}

app.use(express.json());

app.post('/users', validateUserData, (req, resp) => {
  const { username, email } = req.body;
  const newUser = { id: users.length + 1, username, email };
  users.push(newUser);
  resp.status(201).json(newUser);
});

app.get('/users', (req, resp) => {
    resp.json(users);
});

app.get('/users/:userId', (req, resp) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId) || userId < 0 || userId % 1 !== 0) {
        return resp.status(400).json({ error: 'Invalid userId.' });
    }
    const user = users.find(u => u.id === userId);
    if (!user) {
        return resp.status(404).json({ error: 'User not found' });
    }
    resp.json(user);
});

app.delete('/users/:userId', (req, resp) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId) || userId < 0 || userId % 1 !== 0) {
        return resp.status(400).json({ error: 'Invalid userId.' });
    }
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) {
        return resp.status(404).json({ error: 'User not found' });
    }
    users.splice(index, 1);
    resp.status(204).send();
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

process.on('beforeExit', () => {
  try {
    const jsonData = JSON.stringify(users);
    fs.writeFileSync(USERS_FILE, jsonData, 'utf8');
    console.log('Data saved to file:', users);
  } catch (err) {
    console.error('Error saving data to file:', err);
  }
});

app.use((err, req, resp) => {
  console.error(err.stack);
  resp.status(500).send('Internal Server Error');
});

app.listen(PORT, () => {
  console.log('Server is running on port', PORT);
});