const axios = require('axios');

module.exports.config = { 
  name: "dsc", 
  version: "1.0.0", 
  role: 0, 
  description: "Talk with DeepSeek AI (conversational)", 
  aliases: [], 
  hasPrefix: true, 
  usage: "prompt", 
  credits: "Rydex", 
  cooldown: 5 
};

module.exports.run = async ({api, args, event}) => {
  async function reply(a) { 
    api.sendMessage(a, event.threadID, event.messageID); 
  }

  const uid = event.senderID;
  const prompt = encodeURIComponent(args.join(" "));

  if (!prompt) return reply("Please provide a prompt.");

  try {
    await api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
      
      const response = await axios.get(`https://deku-rest-api.gleeze.com/ai/deepseek-coder?q=${prompt}&uid=${uid}`);
      
      const data = response.data.result;
      await api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      return reply(data);
  } 
  catch (e) { 
  	await api.setMessageReaction("❌", event.messageID, (err) => {}, true);
    return reply(`An error occurred : ${e.message}`); 
  }
}
