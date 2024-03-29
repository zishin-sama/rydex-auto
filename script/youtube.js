const ytdl = require('ytdl-core');
const simpleytapi = require('simple-youtube-api');
const path = require('path');
const fs = require('fs');

module.exports.comfig = {
  name: "youtube",
	version: "3.4.4",
  role: 0,
  credits: "Jonell Magallanes",
  hasPrefix: false,
  description: "Search and send YouTube video",
  cooldowns: 3,
};

module.exports.run = async function ({ args, event, api }) {
    const youtube = new simpleytapi('AIzaSyCMWAbuVEw0H26r94BhyFU4mTaP5oUGWRw');

    const searchString = args.join(' ');
    if (!searchString) return api.sendMessage("📝 | Please Enter Your Search Query to Youtube Command", event.threadID);
    
    try {
      const videos = await youtube.searchVideos(searchString, 1);
      api.sendMessage(`⏱️ | Search for ${searchString} Please Wait....`, event.threadID);
      console.log(`downloading Video of ${videos[0].title}`);
      const url = `https://www.youtube.com/watch?v=${videos[0].id}`;

      const videoInfo = await ytdl.getInfo(url);
      const videoTitle = videoInfo.videoDetails.title;
      const videoDescription = videoInfo.videoDetails.description;
      const file = path.resolve(__dirname, 'cache', `video.mp4`);
      console.log(`Downloaded Complete Ready to send The user`);

      ytdl(url, { filter: 'videoandaudio' }).pipe(fs.createWriteStream(file)).on('finish', () => {
        api.sendMessage({
          body: `🎥 | Here's the YouTube video you requested\nURL: ${url}\n\nTitle: ${videoTitle}\nDescription: ${videoDescription}`,
          attachment: fs.createReadStream(file)
        }, event.threadID);
      });
    } catch (error) {
      api.sendMessage("🚨 | An error occurred while searching for the YouTube video.", event.threadID);
    }
};
