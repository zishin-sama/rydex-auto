const axios = require('axios');

module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['bot', 'snow'],
  description: "An AI command powered by GPT-4",
  usage: "ai [prompt]",
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const input = args.join(' ');

  if (!input) {
    api.sendMessage(`𝙷𝙴𝙻𝙻𝙾 𝙸𝙼 𝙰𝙸! 𝙲𝚁𝙴𝙰𝚃𝙴𝙳 𝙱𝚈 𝙲𝙷𝚄𝚁𝙲𝙷𝙸𝙻𝙻 𝙰𝚂𝙺 𝙼𝙴 𝙰𝙽𝚈 𝚀𝚄𝙴𝚂𝚃𝙸𝙾𝙽`, event.threadID, event.messageID);
    return;
  }

  api.sendMessage(`🔍𝙎𝙚𝙖𝙧𝙘𝙝𝙞𝙣𝙜 𝙋𝙡𝙚𝙖𝙨𝙚 𝙒𝙖𝙞𝙩....\n\n━━━━━━━━━━━━━━━━━━\n\n "${input}"`, event.threadID, event.messageID);

  try {
    const { data } = await axios.get(`https://haze-llm-model-74e9fe205264.herokuapp.com/snow?question=${encodeURIComponent(input)}`);
    let response = data.response;
    response += "\n\n𝘛𝘩𝘦 𝘣𝘰𝘵 𝘸𝘢𝘴 𝘤𝘳𝘦𝘢𝘵𝘦𝘥 𝘣𝘺 𝘤𝘩𝘶𝘳𝘤𝘩𝘪𝘭𝘭: https://www.facebook.com/Churchill.Dev4100";
    api.sendMessage(response, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
