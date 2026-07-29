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

// Public ፎልደርን በግልጽ በ Absolute Path ማገናኘት
app.use(express.static(path.join(__dirname, 'public')));

// Root Route - index.html ን በቀጥታ ለመላክ
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Telegram Bot
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