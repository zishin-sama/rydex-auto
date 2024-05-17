const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "texttospeech",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "churchill",
    description: "Convert text to speech using TTS4FREE API",
    commandCategory: "Utilities",
    usages: "[text] | [lang: en, zh, js]",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    // Parse arguments
    const input = args.join(" ").split("|");
    if (input.length < 1) {
        return api.sendMessage("Please provide the text you want to convert to speech.", event.threadID, event.messageID);
    }

    const text = input[0].trim();
    const lang = (input[1] ? input[1].trim() : "en");

    if (text.length > 800) {
        return api.sendMessage("Text should not exceed 800 characters.", event.threadID, event.messageID);
    }

    const encodedText = encodeURIComponent(text);
    const apiUrl = `https://api.kenliejugarap.com/tts4free/?text=${encodedText}&lang=${lang}`;

    try {
        const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
        const audioBuffer = response.data;

        const filePath = path.join(__dirname, 'cache', `${Date.now()}.mp3`);
        fs.writeFileSync(filePath, audioBuffer);

        api.sendMessage({
            body: `Here is your text-to-speech conversion in ${lang.toUpperCase()}.`,
            attachment: fs.createReadStream(filePath)
        }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request. Please try again later.", event.threadID, event.messageID);
    }
};
