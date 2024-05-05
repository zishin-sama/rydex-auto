const axios = require('axios');

module.exports.config = {
  name: 'zedgeimage',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['zedge', 'random'],
  description: "Get a random image from Zedge API",
  usage: "zedgeimage",
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event }) {
  api.sendMessage(`🔍Fetching a random image from Zedge....`, event.threadID, event.messageID);
  
  try {
    const { data } = await axios.get(`https://hashier-api-v1.vercel.app/api/zedge`);
    if (data.image) {
      api.sendMessage({
        body: "",
        attachment: axios({
          url: data.image,
          method: "get",
          responseType: "arraybuffer"
        })
      }, event.threadID);
    } else {
      api.sendMessage('No image found.', event.threadID, event.messageID);
    }
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
