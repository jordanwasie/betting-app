const handleContact = async (ctx) => {
  try {
    const phoneNumber = ctx.message.contact.phone_number;
    const firstName = ctx.from.first_name || 'User';
    const generatedPassword = generatePassword(10);

    const welcomeMsg = 
      `🎉 Welcome, ${firstName}!\n\n` +
      `Your account has been created.\n\n` +
      `📱 Phone: ${phoneNumber}\n` +
      `🔑 Password: ${generatedPassword}\n\n` +
      `⚠️ Save this password! You'll need it to login on other devices.`;

    await ctx.reply(welcomeMsg, Markup.removeKeyboard());

    // ቋሚ የ Render Mini App URL
    const gameUrl = 'https://tobia-bingo-app.onrender.com';

    // በቻቱ ውስጥ በቀጥታ Cache ሳይደረግ የሚከፈት Inline Button
    return ctx.reply(`Hey ${firstName}! 👋\n\nReady to play?`, 
      Markup.inlineKeyboard([
        [Markup.button.webApp('🎮 Play Bingo Now', gameUrl)],
        [Markup.button.callback('💰 Deposit', 'start_deposit')],
        [Markup.button.callback('💲 Check Balance', 'check_balance')]
      ])
    );

  } catch (error) {
    console.error('Contact error:', error);
    await ctx.reply('ምዝገባው ላይ ስህተት አጋጥሟል፣ እባክዎ ደግመው ይሞክሩ።');
  }
};