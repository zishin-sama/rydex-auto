const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
      const response = await axios.get(data.imageUrl, { responseType: 'arraybuffer' });
      const imageData = Buffer.from(response.data, 'binary');
      const imagePath = path.join(__dirname, 'downloaded_images', `${query.replace(/ /g, '_')}.jpg`);
      fs.writeFileSync(imagePath, imageData);
      api.sendMessage({
        body: "Here is your image:",
        attachment: fs.createReadStream(imagePath)
      }, event.threadID);
      fs.unlinkSync(imagePath); // Remove the saved image file after sending
    } else {
      api.sendMessage('No image found.', event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('An error occurred while processing your request:', error);
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
