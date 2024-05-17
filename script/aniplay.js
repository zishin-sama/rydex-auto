const axios = require("axios");
const fs = require("fs");
const path = require("path");
const ffmpeg = require('ffmpeg-static');

async function fetchAnimeEpisodes(animeName) {
    try {
        const response = await axios.get(`https://aniwatch-go.vercel.app/kshitiz?anime=${encodeURIComponent(animeName)}`);
        return response.data.episodes;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch anime episodes");
    }
}

async function fetchEpisodeDownloadLinks(episodeName) {
    try {
        const response = await axios.get(`https://aniwatch-dl.vercel.app/kshitiz?episode=${encodeURIComponent(episodeName)}`);
        return response.data.downloadLinks;
    } catch (error) {
        console.error(error);
        throw new Error("Failed to fetch episode download links");
    }
}

async function trimVideo(videoPath, trimmedPath, startSeconds, duration) {
    const ffmpegCommand = [
        '-i', videoPath,
        '-ss', startSeconds.toString(),
        '-t', duration.toString(),
        '-c', 'copy',
        trimmedPath
    ];
    await new Promise((resolve, reject) => {
        const childProcess = require('child_process').spawn(ffmpeg, ffmpegCommand);
        childProcess.on('close', resolve);
        childProcess.on('error', reject);
    });
}

module.exports = {
    name: "aniplay",
    version: "1.0.0",
    description: "Watch anime episodes",
    credits: "Vex_Kshitiz",//convert by chillimansi
    usage: "aniplay <anime_name>",
    cooldown: 5,
    role: 0,

    run: async function ({ api, event, args }) {
        const animeName = args.join(" ");

        if (!animeName) {
            api.sendMessage("Please provide the name of the anime.", event.threadID, event.messageID);
            return;
        }

        try {
            const episodes = await fetchAnimeEpisodes(animeName);

            if (!episodes || episodes.length === 0) {
                api.sendMessage(`No episodes found for the anime: ${animeName}`, event.threadID, event.messageID);
                return;
            }

            const totalEpisodes = episodes.length;
            const message = `Reply to this message with the episode number.\nTotal Episodes: ${totalEpisodes}`;

            api.sendMessage(message, event.threadID, (err, info) => {
                global.GoatBot.onReply.set(info.messageID, {
                    commandName: "aniplay",
                    messageID: info.messageID,
                    animeName,
                    episodes,
                });
            });
        } catch (error) {
            console.error(error);
            api.sendMessage("Sorry, an error occurred while processing your request.", event.threadID);
        }
    },

    onReply: async function ({ api, event, reply, args }) {
        const { animeName, episodes } = reply;

        const episodeIndex = parseInt(args[0], 10);

        if (isNaN(episodeIndex) || episodeIndex <= 0 || episodeIndex > episodes.length) {
            api.sendMessage("Invalid input. Please provide a valid episode number.", event.threadID, event.messageID);
            return;
        }

        const selectedEpisode = episodes[episodeIndex - 1];
        const episodeName = selectedEpisode[1];

        try {
            const downloadLinks = await fetchEpisodeDownloadLinks(episodeName);
            const downloadLink = downloadLinks['640x360'];
            const cacheFilePath = path.join(__dirname, `cache/anime_${Date.now()}.mp4`);

            const videoResponse = await axios({
                method: 'GET',
                url: downloadLink,
                responseType: 'stream'
            });

            const writeStream = fs.createWriteStream(cacheFilePath);
            videoResponse.data.pipe(writeStream);

            await new Promise((resolve, reject) => {
                writeStream.on('finish', resolve);
                writeStream.on('error', reject);
            });

            await this.trimAndSendVideo(api, event, cacheFilePath);

        } catch (error) {
            console.error(error);
            api.sendMessage("An error occurred while processing the episode. Please try again later.", event.threadID);
        } finally {
            global.GoatBot.onReply.delete(event.messageID);
        }
    },

    trimAndSendVideo: async function (api, event, videoPath) {
        try {
            const firstPartPath = path.join(__dirname, `cache/aniplay_trim1_${Date.now()}.mp4`);
            const secondPartPath = path.join(__dirname, `cache/aniplay_trim2_${Date.now()}.mp4`);

            await trimVideo(videoPath, firstPartPath, 0, 720);
            await trimVideo(videoPath, secondPartPath, 720, 1260);

            const firstPartStream = fs.createReadStream(firstPartPath);
            api.sendMessage({
                body: "First part",
                attachment: firstPartStream
            }, event.threadID);

            setTimeout(() => {
                const secondPartStream = fs.createReadStream(secondPartPath);
                api.sendMessage({
                    body: "Second part",
                    attachment: secondPartStream
                }, event.threadID);
            }, 5000);
        } catch (error) {
            console.error("Error while trimming and sending video:", error);
            api.sendMessage("An error occurred while processing the episode. Please try again later.", event.threadID);
        }
    }
};
