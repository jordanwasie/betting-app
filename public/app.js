let selectedBet = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchMatches();
});

// Fetch Matches from Backend API
async function fetchMatches() {
    const matchesContainer = document.getElementById('matches-list');
    try {
        const response = await fetch('/api/matches');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const matches = await response.json();
        renderMatches(matches);
    } catch (error) {
        console.error('Error loading matches:', error);
        matchesContainer.innerHTML = '<p style="color: #ff4d4d; text-align: center; padding: 20px;">Failed to load live matches. Please refresh the page.</p>';
    }
}

// Render Matches in 1xBet Style
function renderMatches(matches) {
    const matchesContainer = document.getElementById('matches-list');
    
    if (!matches || matches.length === 0) {
        matchesContainer.innerHTML = '<p style="text-align: center; color: #8ba2b5; padding: 20px;">No upcoming matches available at the moment.</p>';
        return;
    }

    matchesContainer.innerHTML = '';

    matches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.className = 'match-card';
        matchElement.innerHTML = `
            <div class="teams-info">
                <span>⚽ ${match.home_team}</span>
                <span>⚽ ${match.away_team}</span>
            </div>
            <div class="odds-buttons">
                <button class="odds-btn" onclick="selectOdds('${match.id}', '${match.home_team} vs ${match.away_team}', '1', ${match.home_odds})">
                    <span class="odds-label">1</span>
                    <span>${match.home_odds}</span>
                </button>
                <button class="odds-btn" onclick="selectOdds('${match.id}', '${match.home_team} vs ${match.away_team}', 'X', ${match.draw_odds})">
                    <span class="odds-label">X</span>
                    <span>${match.draw_odds}</span>
                </button>
                <button class="odds-btn" onclick="selectOdds('${match.id}', '${match.home_team} vs ${match.away_team}', '2', ${match.away_odds})">
                    <span class="odds-label">2</span>
                    <span>${match.away_odds}</span>
                </button>
            </div>
        `;
        matchesContainer.appendChild(matchElement);
    });
}

// Select Odds and Show in Bet Slip
function selectOdds(matchId, matchName, option, odds) {
    selectedBet = { matchId, matchName, option, odds };

    const betInfoBlock = document.getElementById('selected-bet-info');
    const betFormBlock = document.getElementById('place-bet-form');

    if (betInfoBlock) betInfoBlock.style.display = 'none';
    if (betFormBlock) betFormBlock.style.display = 'block';

    const matchNameElem = document.getElementById('slip-match-name');
    const choiceElem = document.getElementById('slip-choice');
    const oddsElem = document.getElementById('slip-odds');

    if (matchNameElem) matchNameElem.innerText = matchName;
    if (choiceElem) choiceElem.innerText = option === '1' ? 'Home Win (1)' : option === '2' ? 'Away Win (2)' : 'Draw (X)';
    if (oddsElem) oddsElem.innerText = odds;

    calculatePayout();
}

// Calculate Potential Payout
const stakeInput = document.getElementById('stake-amount');
if (stakeInput) {
    stakeInput.addEventListener('input', calculatePayout);
}

function calculatePayout() {
    if (!selectedBet) return;
    const stake = parseFloat(document.getElementById('stake-amount').value) || 0;
    const payout = (stake * selectedBet.odds).toFixed(2);
    const payoutElem = document.getElementById('potential-payout');
    if (payoutElem) payoutElem.innerText = `${payout} ETB`;
}

// Place Bet Form Submission
const betForm = document.getElementById('place-bet-form');
if (betForm) {
    betForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedBet) return;

        const stakeAmount = parseFloat(document.getElementById('stake-amount').value);

        const betData = {
            userId: 1,
            matchId: String(selectedBet.matchId),
            selectedOption: selectedBet.option,
            stakeAmount: stakeAmount,
            oddsValue: selectedBet.odds
        };

        try {
            const response = await fetch('/api/bets', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(betData)
            });

            const result = await response.json();
            if (response.ok) {
                alert('🎉 Bet Placed Successfully!');
                location.reload();
            } else {
                alert('Error: ' + (result.error || 'Failed to place bet'));
            }
        } catch (err) {
            alert('Failed to place bet. Please check network connectivity.');
        }
    });
}