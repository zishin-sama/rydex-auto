module.exports.config = {
  name: "ai",
  description: "Talk to GPT (conversational)",
  hasPrefix: false,
  usage: "[ask]",
  role: 0
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');
  let p = args.join(' ');
  let uid = event.senderID;
  
  if (!p) {
    return api.sendMessage('Please enter a prompt.', event.threadID);
  }

  try {
    const response = await axios.get(`https://deku-rest-api-3ijr.onrender.com/gpt4?prompt=${p}&uid=${uid}`);
    return api.sendMessage(response.data.gpt4, event.threadID);
  } catch (error) {
    return api.sendMessage(error.message, event.threadID);
  }
};
