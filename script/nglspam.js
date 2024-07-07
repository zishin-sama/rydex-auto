const fetch = require('node-fetch');

module.exports.config = {
  name: "ngl",
  version: "1.0.0",
  role: 0,
  description: "Spam a message to a target NGL link",
  usage: "ngl [username] | [message] | [amount]",
  aliases: [],
  hasPrefix: true,
  credits: "aze",
  cooldown: 0
};

module.exports.run = async function ({ api, event }) {
  const input = event.body.split('|').map(value => value.trim());
  
  if (input.length !== 3) {
    return api.sendMessage("Invalid input format. Please use 'ngl [username] | [message] | [amount]'", event.threadID);
  }
  
  const [username, message, amount] = input;
  const url = `https://ngl.link/${encodeURIComponent(username)}`;

  try {
    const promises = Array(amount).fill().map(() =>
      fetch(url, { method: 'POST', body: JSON.stringify({ message }), headers: { 'Content-Type': 'application/json' } })
    );

    await Promise.all(promises);

    api.sendMessage(`Spammed to ${username} ${amount} times successfully.`, event.threadID);
  } catch (error) {
    api.sendMessage(`Error occurred while spamming message: ${error}`, event.threadID);
  }
};