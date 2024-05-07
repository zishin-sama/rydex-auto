const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  description: "An AI command powered by GPT-4",
  usage: "ai [query]",
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(' ');

  if (!query) {
    api.sendMessage("Please provide a query.", event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`Thinking...`, event.threadID, event.messageID);

  try {
    const model = 'gpt-4'; // Ito ang tukuyin ang modelo na gagamitin (mula sa API)
    const response = await axios.get(`https://gpt4withcustommodel.onrender.com/gpt?query=${encodeURIComponent(query)}&model=${model}`);
    const answer = response.data;

    if (answer) {
      api.sendMessage(answer, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
