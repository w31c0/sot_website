const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'weico_sot',
  password: 'kuMT)Yq!=Qrr',
  database: 'weico_sot'
});

// Endpoint logowania
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    const user = results[0];
    bcrypt.compare(password, user.password, (err, same) => {
      if (err) return res.status(500).json({ error: 'Hash error' });
      if (same) {
        res.json({ success: true, username: user.username });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    });
  });
});

// Endpoint rejestracji
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) return res.status(500).json({ error: 'Hash error' });
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hash], (err) => {
      if (err) return res.status(500).json({ error: 'User exists or DB error' });
      res.json({ success: true });
    });
  });
});

// (opcjonalnie) endpoint do sprawdzenia czy serwer działa
app.get('/', (req, res) => {
  res.send('weico_sot auth server running');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));