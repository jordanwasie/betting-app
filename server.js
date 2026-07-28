const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database Connection Setup
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false
});

// Default Mock Data for Matches
const defaultMatches = [
    { id: "m1", home_team: "Arsenal", away_team: "Chelsea", home_odds: 1.85, draw_odds: 3.40, away_odds: 4.20 },
    { id: "m2", home_team: "Real Madrid", away_team: "Barcelona", home_odds: 2.10, draw_odds: 3.20, away_odds: 2.95 },
    { id: "m3", home_team: "Manchester City", away_team: "Liverpool", home_odds: 1.95, draw_odds: 3.50, away_odds: 3.80 },
    { id: "m4", home_team: "Bayern Munich", away_team: "Dortmund", home_odds: 1.65, draw_odds: 4.00, away_odds: 5.10 },
    { id: "m5", home_team: "PSG", away_team: "Marseille", home_odds: 1.50, draw_odds: 4.50, away_odds: 6.00 }
];

// API Endpoint to Fetch Matches
app.get('/api/matches', async (req, res) => {
    try {
        if (!process.env.DATABASE_URL) {
            return res.json(defaultMatches);
        }
        const result = await pool.query('SELECT * FROM matches');
        if (result.rows.length === 0) {
            return res.json(defaultMatches);
        }
        res.json(result.rows);
    } catch (err) {
        console.error('Database query error, fallback to default matches:', err.message);
        res.json(defaultMatches);
    }
});

// Fallback Route for Single Page Application
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});