const express = require('express');
const path = require('path');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// List of League IDs (Premier League, La Liga, Serie A, Champions League, Ligue 1)
const LEAGUE_IDS = ['4328', '4335', '4332', '4480', '4334'];

app.get('/api/matches', async (req, res) => {
    try {
        let allMatches = [];

        // Fetch matches from multiple leagues
        const requests = LEAGUE_IDS.map(id => 
            axios.get(`https://api.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=${id}`)
                .catch(() => ({ data: { events: null } }))
        );

        const responses = await Promise.all(requests);

        responses.forEach(response => {
            if (response.data && response.data.events) {
                const matches = response.data.events.map((event, index) => ({
                    id: event.idEvent || `m_${Math.random()}`,
                    home_team: event.strHomeTeam,
                    away_team: event.strAwayTeam,
                    home_odds: (1.4 + Math.random() * 1.8).toFixed(2),
                    draw_odds: (3.1 + Math.random() * 0.9).toFixed(2),
                    away_odds: (2.1 + Math.random() * 2.8).toFixed(2),
                    league: event.strLeague
                }));
                allMatches = allMatches.concat(matches);
            }
        });

        // If API returns matches, send them!
        if (allMatches.length > 0) {
            return res.json(allMatches);
        }

        throw new Error("No live events found from API");

    } catch (err) {
        console.error('API Error, using full live fixtures fallback:', err.message);
        
        // Comprehensive fallback list if API is empty
        res.json([
            { id: "m1", home_team: "Arsenal", away_team: "Chelsea", home_odds: "1.85", draw_odds: "3.40", away_odds: "4.20" },
            { id: "m2", home_team: "Real Madrid", away_team: "Barcelona", home_odds: "2.10", draw_odds: "3.20", away_odds: "2.95" },
            { id: "m3", home_team: "Manchester City", away_team: "Liverpool", home_odds: "1.95", draw_odds: "3.50", away_odds: "3.80" },
            { id: "m4", home_team: "Bayern Munich", away_team: "Dortmund", home_odds: "1.65", draw_odds: "4.00", away_odds: "5.10" },
            { id: "m5", home_team: "PSG", away_team: "Marseille", home_odds: "1.50", draw_odds: "4.50", away_odds: "6.00" },
            { id: "m6", home_team: "Inter Milan", away_team: "AC Milan", home_odds: "2.05", draw_odds: "3.30", away_odds: "3.20" },
            { id: "m7", home_team: "Juventus", away_team: "Roma", home_odds: "1.90", draw_odds: "3.10", away_odds: "4.00" },
            { id: "m8", home_team: "Atletico Madrid", away_team: "Sevilla", home_odds: "1.75", draw_odds: "3.60", away_odds: "4.80" }
        ]);
    }
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Multi-League Sports Server running on port ${PORT}`);
});