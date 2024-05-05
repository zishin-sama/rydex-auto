const axios = require('axios');

module.exports.config = {
  name: 'googleimage',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gimage', 'googleimg'],
  description: "Get an image from Google Images API",
  usage: "googleimagec [search query]",
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function({ api, event, args }) {
  const query = args.join(' ');
  
  if (!query) {
    api.sendMessage(`Please provide a search query.`, event.threadID, event.messageID);
    return;
  }
  
  api.sendMessage(`🔍Searching for Google Images....`, event.threadID, event.messageID);
  
  try {
    const { data } = await axios.get(`https://hashier-api-v1.vercel.app/api/gimage?search=${encodeURIComponent(query)}`);
    if (data.imageUrl) {
      api.sendMessage({
        body: "",
        attachment: axios({
          url: data.imageUrl,
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
