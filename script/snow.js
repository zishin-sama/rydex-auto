const axios = require('axios');

module.exports.config = {
  name: 'snowflakes',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['snow', 'bot'],
  description: "An AI command powered by Snowflakes AI",
  usage: "snowflakes [prompt]",
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ');
  
  if (!input) {
    api.sendMessage(`𝑯𝑬𝑳𝑳𝑶! 𝑰'𝑴 𝑨 𝑺𝑵𝑶𝑾𝑭𝑳𝑨𝑲𝑬𝑺 𝑨𝑰 𝑩𝑶𝑻 ✨ 

━━━━━━━━━━━━━━━

 𝑷𝑳𝑬𝑨𝑺𝑬 𝑷𝑹𝑶𝑽𝑰𝑫𝑬 𝑨 𝑸𝑼𝑬𝑺𝑻𝑰𝑶𝑵/𝑸𝑼𝑬𝑹𝒀`, event.threadID, event.messageID);
    return;
  }
  
  api.sendMessage(`🔍Searching for Snowflakes AI response....
━━━━━━━━━━━━━━━━━━\n\n "${input}"`, event.threadID, event.messageID);
  
  try {
    const { data } = await axios.get(`https://hashier-api-snowflake.vercel.app/api/snowflake?ask=${encodeURIComponent(input)}`);
    const response = data.answer;
    api.sendMessage(response, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
