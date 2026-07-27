const express = require('express');
const axios = require('axios');
const path = require('path');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Key Config
const ODDS_API_KEY = '8bcec2249c795c2c5e6638230386b274';

// 1. Get Live Matches & Odds from The Odds API
app.get('/api/matches', async (req, res) => {
    try {
        const response = await axios.get('https://api.the-odds-api.com/v4/sports/soccer_epl/odds/', {
            params: {
                apiKey: ODDS_API_KEY,
                regions: 'uk',
                markets: 'h2h',
                oddsFormat: 'decimal'
            }
        });

        // Format data for our frontend
        const matches = response.data.map(match => {
            const bookmaker = match.bookmakers[0];
            const market = bookmaker ? bookmaker.markets.find(m => m.key === 'h2h') : null;
            
            let homeOdds = 2.10, drawOdds = 3.20, awayOdds = 2.80;

            if (market && market.outcomes) {
                const homeOutcome = market.outcomes.find(o => o.name === match.home_team);
                const awayOutcome = market.outcomes.find(o => o.name === match.away_team);
                const drawOutcome = market.outcomes.find(o => o.name === 'Draw');

                if (homeOutcome) homeOdds = homeOutcome.price;
                if (awayOutcome) awayOdds = awayOutcome.price;
                if (drawOutcome) drawOdds = drawOutcome.price;
            }

            return {
                id: match.id,
                home_team: match.home_team,
                away_team: match.away_team,
                commence_time: match.commence_time,
                home_odds: homeOdds,
                draw_odds: drawOdds,
                away_odds: awayOdds
            };
        });

        res.json(matches);
    } catch (error) {
        console.error('Error fetching live sports data:', error.message);
        res.status(500).json({ error: 'Failed to fetch live matches' });
    }
});

// 2. Place Bet Endpoint
app.post('/api/bets', async (req, res) => {
    const { userId, matchId, selectedOption, stakeAmount, oddsValue } = req.body;

    if (!userId || !matchId || !selectedOption || !stakeAmount || !oddsValue) {
        return res.status(400).json({ error: 'Missing required bet information.' });
    }

    const potentialPayout = (stakeAmount * oddsValue).toFixed(2);

    try {
        const query = `
            INSERT INTO bets (user_id, match_id, selected_option, stake_amount, odds_value, potential_payout)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [userId, matchId, selectedOption, stakeAmount, oddsValue, potentialPayout];
        const result = await db.query(query, values);

        res.status(201).json({
            message: 'Bet placed successfully!',
            bet: result.rows[0]
        });
    } catch (err) {
        console.error('Error saving bet:', err);
        res.status(500).json({ error: 'Internal server error while placing bet.' });
    }
});

// Serve Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});