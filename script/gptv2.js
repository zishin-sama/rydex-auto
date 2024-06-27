module.exports.config = {
  name: "gpt3v2",
  version: "1.0.0",
  role: 0,
  credits: "Aze",
  hasPrefix: true,
  description: "This module provides AI-powered responses using GPT-3.",
  usage: "<question>",
  cooldown: 5,
  aliases: []
};

const { G4F } = require("g4f");
const g4f = new G4F();

module.exports.run = async function ({ api, event, args }) {
  try {
    const textInput = args.join(' ');
    const role = "user";
    let content = textInput;
    let instructions = "";

    if (args[0] === "instruction") {
      if (args[1]) {
        instructions = `\n\n{role: "system", content: "You are a ${args[1]}."}`;
        content = args.slice(2).join(' ');
        role = "user";
      } else {
        return api.sendMessage('Please provide an instruction after "instruction" keyword.', event.messageID, event.threadID);
      }
    }

    if (args[0] === "reset" || args[0] === "clear" || args[0] === "forget") {
      instructions = "";
      return api.sendMessage('Instructions have been reset.', event.threadID, event.messageID);
    }

    if (!textInput) {
      return api.sendMessage('Please provide a question.', event.messageID, event.threadID);
    }

    const messages = [{ role, content }];

    if (instructions) {
      messages.unshift({ role: "system", content: instructions });
    }

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