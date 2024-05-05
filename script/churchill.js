const axios = require('axios');

module.exports.config = {
  name: 'chill',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  description: "Get response from GPT-4 API",
  usage: "chill [prompt]",
  credits: 'churchillpogi',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const apiUrl = "https://deku-rest-api.replit.app/gpt4";

  try {
    const prompt = args.join(" ");
    if (!prompt) {
      api.sendMessage("𝙰𝚜𝚔𝚒𝚗𝚐 𝚌𝚑𝚞𝚛𝚌𝚑𝚒𝚕𝚕 𝚙𝚕𝚜𝚜 𝚠𝚊𝚒𝚝...", event.threadID, event.messageID);
      return;
    }

    const response = await axios.get(`${apiUrl}?prompt=${encodeURIComponent(prompt)}`);
    const data = response.data;

    if (data.success) {
      const result = data.result;

      // Format the response with space after prompt
      const formattedResponse = `
🧠 **𝑪𝒉𝒖𝒓𝒄𝒉𝒊𝒍𝒍 𝑹𝒆𝒔𝒑𝒐𝒏𝒔𝒆** 🧠\n
Prompt: ${prompt}
Response: ${result}
      `;

      api.sendMessage(formattedResponse, event.threadID, event.messageID);
    } else {
      api.sendMessage("No response found.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while processing the command. Please try again.", event.threadID);
  }
};
