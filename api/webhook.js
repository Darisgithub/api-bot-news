const TelegramBot = require('node-telegram-bot-api');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(200).send('OK');
  }

  const config = require('../src/config');
  const { TOKEN } = config;

  if (!TOKEN) {
    console.error('Missing TOKEN in environment');
    return res.status(500).send('Missing TOKEN');
  }

  // Cache bot and handlers across invocations to avoid duplicate listeners
  if (!global.__bot) {
    const bot = new TelegramBot(TOKEN, { polling: false });
    const { registerCommands } = require('../src/bot/commands');
    const { registerHandlers } = require('../src/bot/handlers');

    registerCommands(bot);
    registerHandlers(bot);

    global.__bot = bot;
  }

  try {
    const update = req.body;
    await Promise.resolve(global.__bot.processUpdate(update));
    return res.status(200).send('OK');
  } catch (err) {
    console.error('Failed to process update:', err);
    return res.status(500).send('Error');
  }
};
