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
    // Set the initial reaction (⏳) indicating the process has started
    await api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
      
    const url = `https://deku-rest-api.gleeze.com/ai/wizardlm?q=${prompt}&uid=${uid}`;
    const response = await axios.get(url);
    const data = response.data.result;

    // Set the success reaction (✅) after the process completes successfully
    await api.setMessageReaction("✅", event.messageID, (err) => {}, true);

    // Reply with the result from the API
    return reply(data);
  } 
  catch (e) { 
    // Set the failure reaction (❌) in case of an error
    await api.setMessageReaction("❌", event.messageID, (err) => {}, true);

    return reply(`An error occurred: ${e.message}`); 
  }
};
