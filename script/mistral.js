const axios = require("axios");

module.exports.config = {
  name: 'mistral',
  version: '1.0.0',
  role: 0,
  hasPrefix: true,
  description: "Get response from Mistral AI",
  usage: "mistral [prompt]",
  credits: 'churchill',
  cooldown: 3,
  aliases: ["mt"]
};

module.exports.run = async function({ api, event, args }) {
  const mistralApiUrl = "https://hashier-api-groq.vercel.app/api/groq/mistral";

  try {
    const prompt = args.join(" ");
    if (!prompt) {
      api.sendMessage("How can I help you? Please provide a prompt.", event.threadID, event.messageID);
      return;
    }

    const response = await axios.get(`${mistralApiUrl}?ask=${encodeURIComponent(prompt)}`);
    const data = response.data.response;

    const formattedResponse = `${data}`;

    api.sendMessage(formattedResponse, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while processing the command. Please try again.", event.threadID);
  }
};
