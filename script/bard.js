const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

module.exports.config = {
  name: 'bard',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  description: "Get completion from Gemini API",
  usage: "bard [text]",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const geminiApiUrl = "https://hashier-api-gemini.vercel.app/api/gemini/completion"; 

  try {
    const text = args.join(" ");
    if (!text) {
      api.sendMessage("Please provide a question or input", event.threadID, event.messageID);
      return;
    }
    
    let imageBase64Array = [];

    const response = await axios.post(geminiApiUrl, {
      prompt: text,
      imageBase64Array,
    });

    const data = response.data.content;

    api.sendMessage(data, event.threadID, event.messageID);
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while processing the command.\nPlease Try Again", event.threadID);
  }
};
