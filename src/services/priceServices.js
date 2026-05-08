const axios = require("axios");
const { ALPHA_API_KEY } = require("../config");

async function getPrice(symbol) {
  const res = await axios.get("https://www.alphavantage.co/query", {
    params: {
      function: "GLOBAL_QUOTE",
      symbol,
      apikey: ALPHA_API_KEY
    }
  });

  const quote = res.data["Global Quote"];
  if (!quote || !quote["05. price"]) return null;

  return {
    price: parseFloat(quote["05. price"]),
    open: parseFloat(quote["02. open"])
  };
  
}


module.exports = { getPrice };