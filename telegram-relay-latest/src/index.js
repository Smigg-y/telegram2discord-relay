const startTelegram = require('./telegram');
const startDiscord = require('./discord');

module.exports = async () => {
  await startDiscord();
  startTelegram();
  console.log('Relay: [ACTIVE]');
};
