const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  description: "AI-like command using the Snow API",
  usage: "ai [message]",
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const message = args.join(' ');

  if (!message) {
    api.sendMessage("Please provide a message.", event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`Thinking...`, event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://haze-llm-model-74e9fe205264.herokuapp.com/snow?question=${encodeURIComponent(message)}`);
    const answer = response.data.response;

    if (answer) {
      api.sendMessage(answer, event.threadID, event.messageID);
    } else {
      api.sendMessage("I couldn't understand that.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
