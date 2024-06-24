const axios = require('axios');

module.exports.config = {
  name: "lyrics",
  version: "1.0.0",
  hasPrefix: true,
  description: "search lyrics",
  usage: "lyrics",
  role: 0,
  cooldown: 5,
  aliases: ["ly"],
  credits: "Aze Kagenou",
};

module.exports.run = async function({api, args, event}) {
  const query = args.join(' ');

  if (!query) {
    return api.sendMessage('Please provide a song name or some lyrics to search for.', event.threadID);
  }

  try {
    const response = await axios.get(`https://deku-rest-api-ywad.onrender.com/search/lyrics?q=${encodeURIComponent(query)}`);
    const data = response.data;

    if (data && data.length > 0) {
      const lyrics = data[0].lyrics; 
      api.sendMessage(lyrics, event.threadID);
    } else {
      api.sendMessage('No lyrics found', event.threadID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage('An error occurred while fetching the lyrics.', event.threadID);
  }
};
