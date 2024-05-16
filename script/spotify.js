const axios = require('axios');
const fs = require('fs');

module.exports.config = {
    name: "spotify",
    version: "1.0.0",
    role: 0,
    hasPermission: 0,
    credits: "cliff",//modbychilli
    description: "Search and play music from Spotify",
    commandCategory: "spotify",
    hasPrefix: false,
    usage: "[song name]",
    cooldowns: 5,
    usePrefix: false,
    usages: "[song name]",
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    // Join the arguments to form the search query
    const listensearch = encodeURIComponent(args.join(" "));
    const apiUrl = `http://94.130.129.40:8370/search/spotify?q=${listensearch}`;

    if (!listensearch) {
        return api.sendMessage("Please provide the name of the song you want to search.", event.threadID, event.messageID);
    }

    try {
        api.sendMessage("🎵 | Searching for your music on Spotify. Please wait...", event.threadID, event.messageID);

        // Send a request to the provided API URL
        const response = await axios.get(apiUrl);

        // Check if the response contains data
        if (response.data && response.data.result && response.data.result.length > 0) {
            const { downloadUrl } = response.data.result[0];

            const filePath = `${__dirname}/cache/${Date.now()}.mp3`;
            const writeStream = fs.createWriteStream(filePath);

            // Fetch the audio stream from the download URL
            const audioResponse = await axios.get(downloadUrl, { responseType: 'stream' });

            // Pipe the audio stream to the write stream
            audioResponse.data.pipe(writeStream);

            writeStream.on('finish', () => {
                // Send the audio file once download is complete
                api.sendMessage({
                    body: `🎧 Here's your music from Spotify. Enjoy listening!\n\nDownload: ${downloadUrl}\n\n💿 Now Playing...`,
                    attachment: fs.createReadStream(filePath),
                }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
            });
        } else {
            api.sendMessage("❓ | Sorry, couldn't find the requested music on Spotify.", event.threadID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("🚧 | An error occurred while processing your request.", event.threadID);
    }
};
