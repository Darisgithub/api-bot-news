const { SYMBOLS } = require("../config");

function registerCommands(bot) {

  bot.onText(/\/as/, (msg) => {
    const keyboard = SYMBOLS.map(s => ([{ text: s, callback_data: s }]));

    bot.sendMessage(msg.chat.id, "Pilih saham:", {
      reply_markup: { inline_keyboard: keyboard }
    });
  });

  bot.onText(/\/list/, (msg) => {
    bot.sendMessage(msg.chat.id, SYMBOLS.join(", "));
  });

  bot.onText(/\/clear/, (msg) => {
    const chatId = msg.chat.id;
    // delete stored messages (only messages the bot has recorded)
    const { getMessages, clearMessages } = require('../utils/messageStore');
    const axios = require('axios');
    const config = require('../config');
    const { TOKEN } = config;

    (async () => {
      try {
        const msgs = await getMessages(chatId);
        for (const mid of msgs) {
          try {
            await axios.post(`https://api.telegram.org/bot${TOKEN}/deleteMessage`, { chat_id: chatId, message_id: mid });
          } catch (e) {}
        }
        await clearMessages(chatId);
        bot.sendMessage(chatId, '✅ Sudah dibersihkan.');
      } catch (e) {
        bot.sendMessage(chatId, '❌ Gagal menghapus history.');
      }
    })();
  });

}

module.exports = { registerCommands };