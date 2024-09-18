const axios = require('axios');

module.exports.config = {
  name: "pinterest",
  version: "1.0.0",
  role: 0,
  credits: "Rydex",
  usage: "pinterest <query>",
  description: "Fetches images from Pinterest based on the search query",
  hasPrefix: true,
  aliases: ["pin"],
  cooldown: 5
};

module.exports.run = async function ({ api, args, event }) {
  if (!args[0]) {
    return api.sendMessage("Please provide a search query.", event.threadID, event.messageID);
  }

  const query = args.join(' ');

  try {
    const response = await axios.get(`https://deku-rest-api.gleeze.com/api/pinterest?q=${encodeURIComponent(query)}`);
    const images = response.data.result;

    if (images.length === 0) {
      return api.sendMessage("No images found for your query.", event.threadID, event.messageID);
    }

    // Send all images
    for (const imageUrl of images) {
      await api.sendMessage({
        body: `Image related to your query: ${query}`,
        attachment: imageUrl
      }, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('Error fetching images:', error);
    api.sendMessage("Sorry, there was an error fetching images.", event.threadID, event.messageID);
  }
};
