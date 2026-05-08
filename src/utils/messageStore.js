const fs = require('fs').promises;
const path = require('path');

const FILE = path.resolve(__dirname, '../../data/messages.json');

async function ensureFile() {
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.access(FILE);
  } catch (e) {
    await fs.writeFile(FILE, JSON.stringify({}), 'utf8');
  }
}

async function readAll() {
  await ensureFile();
  const raw = await fs.readFile(FILE, 'utf8');
  return JSON.parse(raw || '{}');
}

async function writeAll(obj) {
  await ensureFile();
  await fs.writeFile(FILE, JSON.stringify(obj, null, 2), 'utf8');
}

async function addMessage(chatId, messageId) {
  const data = await readAll();
  data[chatId] = data[chatId] || [];
  data[chatId].push(messageId);
  await writeAll(data);
}

async function getMessages(chatId) {
  const data = await readAll();
  return data[chatId] || [];
}

async function clearMessages(chatId) {
  const data = await readAll();
  delete data[chatId];
  await writeAll(data);
}

module.exports = { addMessage, getMessages, clearMessages };
