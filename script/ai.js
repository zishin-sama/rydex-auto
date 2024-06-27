const axios = require('axios');
module.exports.config = {
  name: "ai",
  version: "3.1.0",
  description: "GPT-4(conversational)",
  aliases: [],
  usage: "ai",
  role: 0,
  cooldown: 0,
  credits: "Aze Kagenou"
};

let gpt4 = true;

module.exports.run = async function({ api, event, args }) {
  if (args[0] === "on") {
    gpt4 = true;
    api.sendMessage("GPT-4 activated", event.threadID);
  } else if (args[0] === "off") {
    gpt4 = false;
    api.sendMessage("GPT-4 activated", event.threadID);
  } else {
    api.sendMessage("Invalid command. Please use 'on' or 'off'.", event.threadID);
  }
};

module.exports.handleEvent = async function({ api, event }) {
  if (!gpt4) {
    return;
  }
  
  const prompt = encodeURIComponent(event.body);
  const uid = event.senderID;
  
  try {
    if (event.type === "message_reply") {
      if (event.senderID === event.messageReply.senderID) {
        return;
      }
    }
    
    const response = await axios.get(`https://joshweb.click/gpt4?prompt=${prompt}&uid=${uid}`);
    api.sendMessage(response.data.gpt4, event.threadID, event.messageID);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};