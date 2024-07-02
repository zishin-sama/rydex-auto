const axios = require('axios');

exports.config = {
  name: 'funfact',
  version: '1',
  role: 0,
  hasPrefix: true,
  description: 'Get a random fun fact',
  usage: '{p}{n}',
  cooldown: 0,
  aliases: [],
  credits: 'aze'
};

exports.run = async function ({ api, args, event }) {
  try {
    const response = await axios.get('https://api.icndb.com/jokes/random');
    const fact = response.data.value.joke;
    api.sendMessage(`Fun Fact: ${fact}`, event.threadID);
  } catch (error) {
    console.error(error);
    api.sendMessage('Failed to fetch fun fact. Please try again later.', event.threadID);
  }
};