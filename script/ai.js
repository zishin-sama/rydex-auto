module.exports.config = {
  name: "ai",
  version: "1.0.0",
  credits: "deku",
  description: "Talk to GPT (conversational)",
  hasPrefix: true,
  aliases: [],
  usage: "ai [prompt]",
  role: 0,
  cooldown: 3
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');
  const prompt = args.join(' ');
  const uid = event.senderID;
  
  if (!prompt) {
    return api.sendMessage('How can I help you? Please provide a prompt.', event.threadID);
  }

  try {
    const response = await axios.get(`https://deku-rest-api-pywad.onrender.com/gpt4?prompt=${prompt}&uid=${uid}`);
    return api.sendMessage(response.data.gpt4, event.threadID);
  } catch (error) {
    return api.sendMessage(error.message, event.threadID);
  }
};
