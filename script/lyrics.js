const axios = require('axios');

module.exports.config = { 
  name: "lyrics", 
  version: "1.0.0", 
  role: 0, 
  description: "Fetch lyrics via song title", 
  aliases: ["ly"], 
  hasPrefix: true, 
  usage: "{n}prompt", 
  credits: "Rydex", 
  cooldown: 5 
};

module.exports.run = async ({api, args, event}) => {
  function reply(a) { 
    api.sendMessage(a, event.threadID, event.messageID); 
  }

  const uid = event.senderID;
  const songTitle = args.join(" ");

  if (!songTitle) return reply("Please provide a song title to find lyrics...");

  try {
    if (songTitle)  return reply("Finding lyrics, please wait for a moment"); 
      
      const res = await axios.get(`https:\/\/deku-rest-api.gleeze.com/search/lyrics?q=${songTitle}`);
      const lyrics = res.data.result.lyrics;
      const title = res.data.result.title;
      const artist = res.data.result.artist;

      return reply(`Title : ${title}\n\nArtist : ${artist}\n\nLyrics :\n\n${lyrics}`);
    }
  } 
  catch (e) { 
    return reply(e.message); 
  }
}
