const axios = require('axios');
const fs = require('fs');
const path = require('path');

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
      const response = await axios.get(data.image, { responseType: 'arraybuffer' });
      const imageData = Buffer.from(response.data, 'binary');
      const imagePath = path.join(__dirname, 'downloaded_images', `${Date.now()}_zedge_image.jpg`);
      fs.writeFileSync(imagePath, imageData);
      api.sendMessage({
        body: "Here is your Zedge image:",
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
