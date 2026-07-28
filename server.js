const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Fetch Live Real-World Matches from Free API
app.get('/api/matches', async (req, res) => {
    try {
        // Free Sports API Endpoint
        const response = await axios.get('https://api.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328'); // Premier League
        
        if (response.data && response.data.events) {
            // Live/Upcoming Matches format
            const realMatches = response.data.events.map((event, index) => ({
                id: event.idEvent || `m_${index}`,
                home_team: event.strHomeTeam,
                away_team: event.strAwayTeam,
                home_odds: (1.5 + Math.random() * 1.5).toFixed(2), // Dynamic Odds
                draw_odds: (3.0 + Math.random() * 1.0).toFixed(2),
                away_odds: (2.0 + Math.random() * 2.5).toFixed(2),
                match_time: event.strTime || "LIVE"
            }));
            return res.json(realMatches);
        }
        
        throw new Error("No live data found");
    } catch (err) {
        console.error('API Error, serving fallback live matches:', err.message);
        // Fallback live matches if API limits are reached
        res.json([
            { id: "m1", home_team: "Arsenal", away_team: "Chelsea", home_odds: 1.85, draw_odds: 3.40, away_odds: 4.20 },
            { id: "m2", home_team: "Real Madrid", away_team: "Barcelona", home_odds: 2.10, draw_odds: 3.20, away_odds: 2.95 }
        ]);
    }
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Live Sports Server running on port ${PORT}`);
});