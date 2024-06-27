module.exports.config = {
  name: "gpt3",
  version: "1.0.0",
  role: 0,
  credits: "Aze",
  hasPrefix: true,
  description: "This module provides AI-powered responses using GPT-3.",
  usage: "<question>",
  cooldown: 5,
  aliases: []
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const { G4F } = require("g4f");
    const g4f = new G4F();
    const textInput = args.join(' ');
    if (!textInput) return api.sendMessage('Please provide a question.',event.messageID, event.threadID);
    const messages = [
      { role: "user", content: textInput }
    ];
    const options = {
      provider: g4f.providers.GPT,
      model: "gpt-3.5-turbo",
      debug: true,
      proxy: ""
    };
    const response = await g4f.chatCompletion(messages, options);
    api.sendMessage(response, event.threadID, event.messageID);
  } catch (error) {
    return api.sendMessage(error.message, event.threadID, event.messageID);
  }
}