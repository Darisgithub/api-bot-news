function formatPrice(symbol, data) {
  if (!data) return `Data ${symbol} tidak tersedia`;

  const change = ((data.price - data.open) / data.open) * 100;

  return `📊 ${symbol}
Harga: $${data.price}
Perubahan: ${change.toFixed(2)}%`;
}

function formatNews(articles) {
  if (!articles.length) return "Tidak ada berita";

  return articles.map((a, i) =>
    `${i + 1}. ${a.title}`
  ).join("\n\n");
}

module.exports = { formatPrice, formatNews };