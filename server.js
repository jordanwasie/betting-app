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

// Root route - Render/Mini App index.html ን በቀጥታ እንዲያነብ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Telegram Bot Setup
const bot = new Telegraf(process.env.BOT_TOKEN || '8717205197:AAEXpsXLqd7cATEMhrgUtaaF5legJgpcz8E');

bot.start(handleStart);
bot.on('contact', handleContact);
bot.action(/bank_.+/, handleBankSelection);
bot.on('text', handleTextMessage);

bot.launch();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});