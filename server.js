require('dotenv').config();
const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

// 1. የፊት ገፅ (Frontend) ፋይሎችን ለማስተናገድ
app.use(express.static('public'));

// 2. Health Check API (ሰርቨሩ እና ዳታቤዙ መስራታቸውን ለማረጋገጥ)
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ success: true, db_time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. የጨዋታዎችን ዝርዝር ከዳታቤዝ የሚያመጣ API
app.get('/api/matches', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM matches WHERE is_active = true');
    res.json({ success: true, matches: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. የተጠቃሚውን የገንዘብ መጠን (Wallet Balance) የሚያመጣ API
app.get('/api/user/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, username, wallet_balance FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. ውርርድ መመዝገቢያ (Place Bet) API
app.post('/api/bets/place', async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId, matchId, selectedOption, stakeAmount, oddsValue } = req.body;

    await client.query('BEGIN');

    // ሀ. የተጠቃሚውን ቀሪ ሂሳብ ማረጋገጥ
    const userRes = await client.query('SELECT wallet_balance FROM users WHERE id = $1 FOR UPDATE', [userId]);
    if (userRes.rows.length === 0) {
      throw new Error('User not found');
    }

    const currentBalance = parseFloat(userRes.rows[0].wallet_balance);
    if (currentBalance < stakeAmount) {
      throw new Error('Insufficient balance');
    }

    // ለ. የገንዘብ መጠን መቀነስ
    const newBalance = currentBalance - stakeAmount;
    await client.query('UPDATE users SET wallet_balance = $1 WHERE id = $2', [newBalance, userId]);

    // ሐ. ውርርዱን መመዝገብ
    const potentialPayout = stakeAmount * oddsValue;
    const betRes = await client.query(
      `INSERT INTO bets (user_id, match_id, selected_option, stake_amount, odds_value, potential_payout) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, matchId, selectedOption, stakeAmount, oddsValue, potentialPayout]
    );

    await client.query('COMMIT');
    res.json({ success: true, bet: betRes.rows[0], newBalance });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(400).json({ success: false, error: error.message });
  } finally {
    client.release();
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});