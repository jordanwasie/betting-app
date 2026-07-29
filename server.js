require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
const cors = require('cors');

// Controllers እና Configs ማስገባት
const db = require('./config/db');
const { handleStart, handleContact } = require('./controllers/botController');

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.static('public'));
// Telegram Bot setup
// ከዚህ በፊት የነበረው፡
// const bot = new Telegraf(process.env.BOT_TOKEN);

// በአዲሱ እንዲህ ተካው (ቶከንህን በቀጥታ አስገባው)፡
const bot = new Telegraf('8717205197:AAEXpsXLqd7cATEMhrgUtaaF5legJgpcz8E');

// Bot Handlers
bot.start(handleStart);
bot.on('contact', handleContact);

// Basic API Route (ለ Mini App ቴስት ማድረግያ)
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Bingo Server is running smooth!' });
});

// Express Server ማስነሻ
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Bot ማስነሳት
bot.launch()
  .then(() => console.log('🤖 Telegram Bot started successfully!'))
  .catch((err) => console.error('Bot launch error:', err));

// Unhandled termination protection
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
const express = require('express');
const { Telegraf } = require('telegraf');
const path = require('path');
const { 
  handleStart, 
  handleContact, 
  handleTextMessage, 
  handleBankSelection 
} = require('./controllers/botController');

const app = express();

app.use(express.json());
app.use(express.static('public'));

// Root route for Render/Telegram Mini App
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Telegram Bot Setup
const bot = new Telegraf(process.env.BOT_TOKEN || '8717205197:AAEXpsXLqd7cATEMhrgUtaaF5legJgpcz8E');

bot.start(handleStart);
bot.on('contact', handleContact);
bot.action(/bank_.+/, handleBankSelection); // Telebirr እና CBE Birr በተኖችን መቀበያ
bot.on('text', handleTextMessage);         // የፅሁፍ መልእክቶችንና Deposit Flow ን መቀበያ

bot.launch();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});