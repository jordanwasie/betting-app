const { Markup } = require('telegraf');

// /start command
const handleStart = (ctx) => {
  const instructions = 
    `እንኳን ወደ Lion Bet / Bingo ቦት በሰላም መጡ!\n\n` +
    `ወደ ጨዋታው ለመግባት:\n` +
    `1. ከታች ያለውን "Share My Contact" የሚለውን ይጫኑ\n` +
    `2. ስልክ ቁጥርዎን ከተላከ በኋላ "Play Bingo" የሚለውን ይጫኑ`;

  return ctx.reply(instructions, 
    Markup.keyboard([
      [Markup.button.contactRequest('📱 Share My Contact')],
      [Markup.button.webApp('🎰 Play Bingo', process.env.WEBAPP_URL || 'https://google.com')]
    ]).resize()
  );
};

// User Contact መቀበያ
const handleContact = async (ctx) => {
  try {
    const phoneNumber = ctx.message.contact.phone_number;
    const firstName = ctx.from.first_name;

    console.log(`✅ የተመዘገበ ተጠቃሚ: ${firstName} | ስልክ: ${phoneNumber}`);

    await ctx.reply(`እናመሰግናለን ${firstName}! ስልክ ቁጥርዎ በትክክል ተመዝግቧል። አሁን "Play Bingo" የሚለውን ተጭነው መጫወት ይችላሉ።`);
  } catch (error) {
    console.error('Contact error:', error);
    await ctx.reply('ምዝገባው ላይ ስህተት አጋጥሟል፣ እባክዎ ደግመው ይሞክሩ።');
  }
};

module.exports = { handleStart, handleContact };