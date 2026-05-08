const axios = require("axios");
const { NEWS_API_KEY } = require("../config");

async function getNews(symbol) {
  try {
    const res = await axios.get("https://newsapi.org/v2/everything", {
      params: {
        q: symbol,
        language: "en",
        sortBy: "publishedAt",
        apiKey: NEWS_API_KEY,
        pageSize: 3
      }
    });

    return res.data.articles || [];
  } catch {
    return [];
  }
}

module.exports = { getNews };