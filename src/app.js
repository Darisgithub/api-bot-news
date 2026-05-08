const TelegramBot = require("node-telegram-bot-api");
const config = require("./config");
const { registerCommands } = require("./bot/commands");
const { registerHandlers } = require("./bot/handlers");

const { TOKEN } = config;

if (!TOKEN) {
	console.error("Missing TOKEN in environment. Create a .env with TOKEN=<your token>");
	process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

registerCommands(bot);
registerHandlers(bot);

console.log("Bot jalan...");