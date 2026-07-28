const express = require('express');
const path = require('path');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection with SSL Support
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

pool.on('error', (err) => {
  console.error('Database pool error (non-fatal):', err.message);
});

// Matches API Endpoint
app.get('/api/matches', async (req, res) => {
  try {
    const mockMatches = [
      {
        id: '1',
        league: 'English Premier League',
        time: '2026-08-21 19:00 EAT',
        home: 'Arsenal',
        away: 'Coventry City',
        score: '0 - 0',
        odds: { '1': 1.45, '2': 2.80, '12': 1.28, 'X': 3.20, '1X': 1.22, 'X2': 1.65, 'O2.5': 1.70, 'U2.5': 2.10 }
      },
      {
        id: '2',
        league: 'La Liga',
        time: '2026-08-21 21:00 EAT',
        home: 'Real Madrid',
        away: 'Barcelona',
        score: '1 - 1',
        odds: { '1': 2.10, '2': 2.95, '12': 1.28, 'X': 3.20, '1X': 1.35, 'X2': 1.60, 'O2.5': 1.65, 'U2.5': 2.20 }
      },
      {
        id: '3',
        league: 'UEFA Champions League',
        time: '2026-08-22 20:00 EAT',
        home: 'Bayern Munich',
        away: 'PSG',
        score: '0 - 0',
        odds: { '1': 1.90, '2': 3.80, '12': 1.25, 'X': 3.60, '1X': 1.25, 'X2': 1.85, 'O2.5': 1.55, 'U2.5': 2.40 }
      },
      {
        id: '4',
        league: 'Serie A',
        time: '2026-08-22 22:45 EAT',
        home: 'Inter Milan',
        away: 'Juventus',
        score: '2 - 1',
        odds: { '1': 2.05, '2': 3.40, '12': 1.30, 'X': 3.10, '1X': 1.28, 'X2': 1.70, 'O2.5': 1.80, 'U2.5': 1.95 }
      }
    ];

    res.json(mockMatches);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch matches' });
  }
});

// Single-Page Routing Middleware
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`ArenaBets Platform Live on Port ${PORT}`);
});