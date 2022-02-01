const { Client, Intents, MessageEmbed, MessageAttachment, Message } = require('discord.js');
const { discord_token, telegram_channels, discord_channels } = require('./../config.json');
const bus = require('./messagebus');

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

var stringToColour = function(str) {
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  };

  var colour = '#';
  for (var i = 0; i < 3; i++) {
    var value = (hash >> (i * 8)) & 0xFF;
    colour += ('00' + value.toString(16)).substr(-2);
  };

  return colour;
};

bus.on('message', async (text, nameUser, userImage, title, chDef) => {
  const channel = client.channels.cache.get(discord_channels[chDef]);

  const telegramMsg = new MessageEmbed()
    .setColor(stringToColour(nameUser))
    .setTitle(`${nameUser}:`)
    .setDescription(text)
    .setAuthor({ name: `[${title}]`, iconURL: userImage })
  channel.send({ embeds: [telegramMsg] });
});

bus.on('image', async(uploadedImage, defCaption, nameUser, userImage, title, chDef) => {
  const channel = await client.channels.fetch(discord_channels[chDef]);

  const telegramMsg = new MessageEmbed()
    .setColor(stringToColour(nameUser))
    .setTitle(`${nameUser}:`)
    .setDescription(defCaption)
    .setImage(uploadedImage)
    .setAuthor({ name: `[${title}]`, iconURL: userImage })
  channel.send({ embeds: [telegramMsg] });
});

bus.on('doc', async(uploadedDoc, defCaption, nameUser, userImage, title, chDef) => {
  const channel = client.channels.cache.get(discord_channels[chDef]);

  const file = new MessageAttachment(uploadedDoc);
  
  const telegramMsg = new MessageEmbed()
    .setColor(stringToColour(nameUser))
    .setTitle(`${nameUser} sent a File`)
    .setDescription(defCaption)
    .setAuthor({ name: `[${title}]`, iconURL: userImage })
  channel.send({ embeds: [telegramMsg], files: [file] });
});

client.on('error', () => {});

module.exports = () =>
  new Promise((resolve) => {
  client.on('ready', () => {
    console.log(`Discord Bot: [ONLINE]`);
    resolve();
  });

	client.login(discord_token);
});