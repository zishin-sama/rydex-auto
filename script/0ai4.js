const axios = require('axios');

module.exports.config = { 
  name: "wizard", 
  version: "1.0.0", 
  role: 0, 
  description: "Talk with Microsoft WizardLM (conversational)", 
  aliases: ["msw","wiz"], 
  hasPrefix: true, 
  usage: "prompt", 
  credits: "Rydex", 
  cooldown: 5 
};

module.exports.run = async ({ api, args, event }) => {
  function reply(a) { 
    api.sendMessage(a, event.threadID, event.messageID); 
  }

  const uid = event.senderID;
  const prompt = encodeURIComponent(args.join(" "));

  if (!prompt) return reply("Please provide a prompt.");

  try {
    const response = await axios.get(`https://deku-rest-api.gleeze.com/ai/wizardlm?q=${prompt}&uid=${uid}`);
    const data = response.data.result;
    return reply(data);
  } 
  catch (e) { 
    return reply(`An error occurred: ${e.message}`); 
  }
};
