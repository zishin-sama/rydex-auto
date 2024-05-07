const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt', 'openai'],
  description: "An AI command powered by GPT-4",
  usage: "Ai [prompt]",
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ');

  if (!input) {
    api.sendMessage("Please provide a question/query.", event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`Searching, please wait...\n\n"${input}"`, event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://haze-llm-model-74e9fe205264.herokuapp.com/snow?question=${encodeURIComponent(input)}`);
    const answer = response.data.responseProperty; // Replace 'responseProperty' with the actual property name from the API response

    if (answer) {
      const messageWithCredits = `${answer}\n\n𝗰𝗿𝗲𝗱𝗶𝘁𝘀: https://www.facebook.com/Churchill.Dev4100`;
      api.sendMessage(messageWithCredits, event.threadID, event.messageID);
    } else {
      api.sendMessage("I didn't get a response.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
