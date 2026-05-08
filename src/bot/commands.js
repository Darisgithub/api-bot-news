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

}

module.exports = { registerCommands };