const axios = require('axios');

module.exports.config = {
  name: 'cdp',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  description: "Get a random couple picture",
  usage: "cdp",
  credits: 'churchill',
  cooldown: 3,
};

module.exports.run = async function({ api, event }) {
  const apiUrl = "https://deku-rest-api.replit.app/coupledp";

  try {
    const response = await axios.get(apiUrl);
    const imageUrl = response.data.imageUrl;

    if (imageUrl) {
      api.sendMessage({
        body: "Here is a random couple picture:",
        attachment: axios({
          url: imageUrl,
          method: "get",
          responseType: "arraybuffer"
        })
      }, event.threadID);
    } else {
      api.sendMessage("No couple picture found.", event.threadID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while processing the command. Please try again.", event.threadID);
  }
};
