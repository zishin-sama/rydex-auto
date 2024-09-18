const axios = require('axios');
const fs = require('fs');
const ytdl = require('ytdl-core');
const { exec } = require('child_process');

module.exports.config = {
    name: "music",
    version: "1.0.0",
    description: "Fetch lyrics, song, and audio.",
    role: 0,
    credits: "Rydex",
    usage: "songname",
    hasPrefix: true,
    aliases: ["sc"],
    cooldown: 5,
};

module.exports.run = async function ({ api, args, event }) {
    try {
        if (args.length < 1) {
            return api.sendMessage("Please provide a song name.", event.threadID, event.messageID);
        }

        const query = args.join(' ');
        const musicUrl = `https://deku-rest-api.gleeze.com/api/scsearch?q=${encodeURIComponent(query)}`;
        const lyricsUrl = `https://deku-rest-api.gleeze.com/search/lyrics?q=${encodeURIComponent(query)}`;

        // Fetch music and lyrics data
        const musicResponse = await axios.get(musicUrl);
        const lyricsResponse = await axios.get(lyricsUrl);

        if (!musicResponse.data.result.length || !lyricsResponse.data.result) {
            return api.sendMessage("No music or lyrics found for your query.", event.threadID, event.messageID);
        }

        const song = musicResponse.data.result[0]; // First song result
        const lyricsData = lyricsResponse.data.result; // Lyrics data

        const title = song.title;
        const artist = lyricsData.artist;
        const lyrics = lyricsData.lyrics;
        const imageUrl = lyricsData.image; // Cover image
        const audioUrl = song.link;

        // Send Title, Artist, and Lyrics message with image
        const message = {
            body: `Title: ${title}\n\nArtist: ${artist}\n\nLyrics:\n\n${lyrics}`,
            attachment: []
        };

        // Fetch and attach image
        const imageResponse = await axios.get(imageUrl, { responseType: 'stream' });
        const imagePath = __dirname + `/song_cover_${event.senderID}.jpg`;
        const writer = fs.createWriteStream(imagePath);
        imageResponse.data.pipe(writer);

        writer.on('finish', async () => {
            message.attachment.push(fs.createReadStream(imagePath));

            // Download and convert SoundCloud audio using ytdl-core
            const audioFilePath = __dirname + `/song_audio_${event.senderID}.mp3`;
            downloadAndConvertAudio(audioUrl, audioFilePath, async (err) => {
                if (err) {
                    return api.sendMessage("Error downloading or converting audio.", event.threadID, event.messageID);
                }

                // Attach audio to the message
                message.attachment.push(fs.createReadStream(audioFilePath));

                // Send the message with image and audio
                api.sendMessage(message, event.threadID, event.messageID);

                // Clean up files after sending
                fs.unlinkSync(imagePath);
                fs.unlinkSync(audioFilePath);
            });
        });
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
};

// Helper function to download and convert SoundCloud audio using ytdl-core
function downloadAndConvertAudio(audioUrl, filePath, callback) {
    const stream = ytdl(audioUrl, { filter: 'audioonly' });
    const writeStream = fs.createWriteStream(filePath);

    stream.pipe(writeStream);
    writeStream.on('finish', () => {
        callback(null);
    });
    writeStream.on('error', (err) => {
        callback(err);
    });
}
