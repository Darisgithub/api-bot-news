const axios = require('axios');
const config = require('../src/config');

const { TOKEN } = config;

if (!TOKEN) {
  console.error('Missing TOKEN in environment');
  process.exit(1);
}

const commands = [
  { command: 'as', description: 'Pilih saham (tampilkan inline keyboard)' },
  { command: 'list', description: 'Tampilkan daftar simbol' },
  { command: 'clear', description: 'Bersihkan / reset (bot action)' },
  { command: 'help', description: 'Bantuan singkat' }
];

async function setCommands() {
  try {
    const res = await axios.post(`https://api.telegram.org/bot${TOKEN}/setMyCommands`, {
      commands,
    });
    console.log('setMyCommands result:', res.data);
  } catch (err) {
    console.error('Failed to set commands:', err.response ? err.response.data : err.message);
    process.exit(1);
  }
}

setCommands();
