const axios = require('axios');
const config = require('../src/config');
const { SYMBOLS, TOKEN } = config;
const { getPrice } = require('../src/services/priceServices');
const { getNews } = require('../src/services/newsServices');
const { formatPrice, formatNews } = require('../src/utils/formatter');

const TELE_API = (method) => `https://api.telegram.org/bot${TOKEN}/${method}`;

async function sendMessage(chatId, text, extra = {}) {
  const res = await axios.post(TELE_API('sendMessage'), {
    chat_id: chatId,
    text,
    ...extra,
  });
  // record sent message id
  try {
    const { addMessage } = require('../src/utils/messageStore');
    if (res.data && res.data.result && res.data.result.message_id) {
      addMessage(String(chatId), res.data.result.message_id).catch(() => {});
    }
  } catch (e) {}
  return res;
}

async function answerCallback(callbackId) {
  try {
    await axios.post(TELE_API('answerCallbackQuery'), { callback_query_id: callbackId });
  } catch (e) {
    // ignore
  }
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(200).send('OK');

  if (!TOKEN) {
    console.error('Missing TOKEN in environment');
    return res.status(500).send('Missing TOKEN');
  }

  const update = req.body || {};

  try {
    // Handle message commands (/as, /list)
    if (update.message && update.message.text) {
      const text = update.message.text.trim();
      const chatId = update.message.chat.id;

      if (/^\/as\b/.test(text)) {
        const keyboard = SYMBOLS.map((s) => [{ text: s, callback_data: s }]);
        await sendMessage(chatId, 'Pilih saham:', { reply_markup: { inline_keyboard: keyboard } });
        return res.status(200).send('OK');
      }

      if (/^\/list\b/.test(text)) {
        await sendMessage(chatId, SYMBOLS.join(', '));
        return res.status(200).send('OK');
      }

      if (/^\/clear\b/.test(text)) {
        await sendMessage(chatId, '✅ Sudah dibersihkan.');
        return res.status(200).send('OK');
      }
    }

    // Handle callback_query (button clicks)
    if (update.callback_query) {
      const symbol = update.callback_query.data;
      const chatId = update.callback_query.message.chat.id;
      const callbackId = update.callback_query.id;

      // acknowledge callback to stop loading
      answerCallback(callbackId).catch(() => {});

      const price = await getPrice(symbol);
      const news = await getNews(symbol);

      const msg = `\n${formatPrice(symbol, price)}\n\n📰 News:\n${formatNews(news)}`;

      await sendMessage(chatId, msg);
      return res.status(200).send('OK');
    }

    // handle /clear
    if (update.message && update.message.text && /^\/clear\b/.test(update.message.text)) {
      const chatId = update.message.chat.id;
      try {
        const msgs = await require('../src/utils/messageStore').getMessages(String(chatId));
        for (const mid of msgs) {
          try { await axios.post(TELE_API('deleteMessage'), { chat_id: chatId, message_id: mid }); } catch (e) {}
        }
        await require('../src/utils/messageStore').clearMessages(String(chatId));
        await sendMessage(chatId, '✅ Sudah dibersihkan.');
        return res.status(200).send('OK');
      } catch (e) {
        console.error('clear error', e);
        return res.status(500).send('Error');
      }
    }

    return res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook processing error:', err);
    return res.status(500).send('Error');
  }
};
