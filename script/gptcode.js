const { G4F } = require("g4f");
const g4f = new G4F();

module.exports.config = {
  name: "codegpt",
  version: "1.0.0",
  role: 0,
  credits: "Aze",
  hasPrefix: true,
  description: "This module provides AI-powered responses using GPT-4.",
  usage: "<question>",
  cooldown: 5,
  aliases: []
};

module.exports.run = async function ({ api, event, args }) {
    try {
      const uids = []; 
      const textInput = args.join(" ");

      if (!textInput)
        return api.sendMessage("Please provide a question.", event.messageID, event.threadID);

      if (uids.includes(event.senderID)) {
        const index = uids.indexOf(event.senderID);
        uids.splice(index, 1);
      }

      const messages = [{ role: "system", content: "You're a programming genius." }];

      if (textInput.toLowerCase().includes("clear") || textInput.toLowerCase().includes("reset")) {
        uids.splice(uids.indexOf(event.senderID), 1);
        return api.sendMessage("Your history has been cleared.", event.threadID, event.messageID);
      }

      messages.push({ role: "user", content: textInput });

      const options = {
        provider: g4f.providers.GPT,
        model: "gpt-4",
        debug: true,
        proxy: "",
      };

      const response = await g4f.chatCompletion(messages, options);

      api.sendMessage(response, event.threadID, event.messageID);

      if (!uids.includes(event.senderID)) {
        uids.push(event.senderID);
      }
    } catch (error) {
      console.error(error);
      return api.sendMessage("An error occurred. Please try again later.", event.threadID, event.messageID);
  }
};