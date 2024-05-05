const axios = require('axios');

module.exports.config = {
  name: 'egif',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  description: "Convert emoji to GIF",
  usage: "egif [emoji]",
  credits: 'churchill',
  cooldown: 4,
};

module.exports.run = async function({ api, event, args }) {
  const apiUrl = "https://deku-rest-api.replit.app/emoji2gif";

  try {
    const emoji = args[0];
    if (!emoji) {
      api.sendMessage("Please provide an emoji.", event.threadID, event.messageID);
      return;
    }

    const response = await axios.get(`${apiUrl}?q=${encodeURIComponent(emoji)}`);
    const gifUrl = response.data.url;

    if (gifUrl) {
      api.sendMessage({
        body: `Here is a GIF for the emoji ${emoji}:`,
        attachment: axios({
          url: gifUrl,
          method: "get",
          responseType: "arraybuffer"
        })
      }, event.threadID);
    } else {
      api.sendMessage("No GIF found for the emoji.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while processing the command. Please try again.", event.threadID);
  }
};
