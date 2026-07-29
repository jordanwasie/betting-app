const MOCK_USER_ID = "66a541234567890abc123456";
let selectedOdds = null;

// 1. Fetch & Display Matches
async function loadMatches() {
  const container = document.getElementById('matches-container');
  if (!container) return;

  try {
    const res = await fetch('/api/sports/matches');
    const matches = await res.json();

    container.innerHTML = matches.map(m => `
      <div style="border: 1px solid #2a2e39; background: #1e222d; color: #fff; padding: 15px; margin-top: 10px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="color: #fff;">${m.homeTeam}</strong> <span style="color: #888;">vs</span> <strong style="color: #fff;">${m.awayTeam}</strong>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="selectBet('${m.homeTeam} Win', ${m.odds.home})" style="background: #2b303c; color: #4caf50; border: 1px solid #444; padding: 8px 12px; border-radius: 4px; cursor: pointer;">1 (${m.odds.home})</button>
          <button onclick="selectBet('Draw', ${m.odds.draw})" style="background: #2b303c; color: #4caf50; border: 1px solid #444; padding: 8px 12px; border-radius: 4px; cursor: pointer;">X (${m.odds.draw})</button>
          <button onclick="selectBet('${m.awayTeam} Win', ${m.odds.away})" style="background: #2b303c; color: #4caf50; border: 1px solid #444; padding: 8px 12px; border-radius: 4px; cursor: pointer;">2 (${m.odds.away})</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Error:', err);
    container.innerHTML = '<p style="color: red;">Error loading live matches.</p>';
  }
}

// 2. Select Bet
function selectBet(type, odds) {
  selectedOdds = odds;
  document.getElementById('selected-bet').innerText = `Selected: ${type} @ ${odds}`;
}

// 3. Place Bet
async function placeBet() {
  const stake = document.getElementById('stake-input').value;
  if (!selectedOdds) return alert("እባክዎን አስቀድመው Odds ይምረጡ!");

  try {
    const res = await fetch('/api/bets/place', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: MOCK_USER_ID, stake: Number(stake), odds: selectedOdds })
    });
    const data = await res.json();

    if (data.success) {
      alert(data.message);
      document.getElementById('user-balance').innerText = `${data.newBalance.toFixed(2)} ETB`;
    } else {
      alert(data.message || "ስህተት ተከስቷል");
    }
  } catch (err) {
    console.error(err);
  }
}

// 4. Socket.io for Aviator
const socket = io();
const aviatorDisplay = document.getElementById('aviator-display');

socket.on('aviator_tick', (data) => {
  if (aviatorDisplay) {
    aviatorDisplay.style.color = '#ff9800';
    aviatorDisplay.innerText = `${data.multiplier.toFixed(2)}x`;
  }
});

socket.on('aviator_crash', (data) => {
  if (aviatorDisplay) {
    aviatorDisplay.style.color = '#f44336';
    aviatorDisplay.innerText = `CRASHED @ ${data.crashPoint.toFixed(2)}x`;
  }
});

// Start Load
document.addEventListener('DOMContentLoaded', loadMatches);