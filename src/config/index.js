require("dotenv").config();

module.exports = {
  TOKEN: process.env.TOKEN,
  CHAT_ID: process.env.CHAT_ID,
  ALPHA_API_KEY: process.env.ALPHA_API_KEY,
  NEWS_API_KEY: process.env.NEWS_API_KEY,
  SYMBOLS: ["NVDA", "AAPL", "TSLA", "MSFT"]
};