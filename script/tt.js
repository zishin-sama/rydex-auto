const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "tt",
    aliases: [],
    version: "1.0",
    author: "kshitiz",
    countDown: 10,
    role: 0,
    shortDescription: "",
    longDescription: "",
    category: "",
    guide: "{pn search}",
  },

  onStart: async function ({ api, event, args }) {
    try {
      const searchQuery = args.join(" ");
      if (!searchQuery) {
        api.sendMessage("Usage: tt <search text>", event.threadID);
        return;
      }

      api.sendMessage("Searching, please wait...", event.threadID);

      const response = await axios.get(`https://hiroshi.hiroshiapi.repl.co/tiktok/searchvideo?keywords=${encodeURIComponent(searchQuery)}`);
      const videos = response.data.data.videos;

      if (!videos || videos.length === 0) {
        api.sendMessage("No TikTok videos found for your query.", event.threadID);
        return;
      }

      const videoData = videos[0];
      const videoUrl = videoData.play;

      const message = `TikTok Result:\n\nPosted by: ${videoData.author.nickname}\nUsername: ${videoData.author.unique_id}\n\nTitle: ${videoData.title}`;

      const filePath = path.join(__dirname, `/cache/tiktok_video.mp4`);
      const writer = fs.createWriteStream(filePath);

      const videoResponse = await axios({
        method: 'get',
        url: videoUrl,
        responseType: 'stream'
      });

      videoResponse.data.pipe(writer);

      writer.on('finish', () => {
        api.sendMessage(
          { body: message, attachment: fs.createReadStream(filePath) },
          event.threadID,
          () => fs.unlinkSync(filePath)
        );
      });
    } catch (error) {
      console.error('Error:', error);
      api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
  }
};
