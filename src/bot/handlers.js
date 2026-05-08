const { getPrice } = require("../services/priceServices");
const { getNews } = require("../services/newsServices");
const { formatPrice, formatNews } = require("../utils/formatter");

function registerHandlers(bot) {

  bot.on("callback_query", async (q) => {
    const symbol = q.data;
    const chatId = q.message.chat.id;

    const price = await getPrice(symbol);
    const news = await getNews(symbol);

    const msg = `
${formatPrice(symbol, price)}

📰 News:
${formatNews(news)}
    `;

    bot.sendMessage(chatId, msg);
  });

}

module.exports = { registerHandlers };