const axios = require('axios');

module.exports.config = {
    name: "voicevox",
    version: "1.0.0",
    credits: "chilli mansi",
    role: 0,
    description: "Generate voice using Voicevox Speaker API",
    hasPrefix: false,
    usage: "{pn} (speaker UUID) | text",
    cooldown: 5,
    aliases: ["vv", "voice"],
};

module.exports.run = async function ({ api, args, event }) {
    const command = args.join(" ").split("|");
    if (command.length !== 2) {
        return api.sendMessage("❌ Invalid command format. Use it like this:\nvoicevox (speaker UUID) | text", event.threadID, event.messageID);
    }

    const speakerUuid = command[0].trim().toLowerCase();
    const text = command[1].trim();

    const apiUrl = `https://joshweb.click/new/voicevox-speaker?text=${encodeURIComponent(text)}&speakerUuid=${speakerUuid}`;

    try {
        const response = await axios.get(apiUrl);

        if (response && response.data && response.data.success) {
            return api.sendMessage({ attachment: response.data.audio }, event.threadID, event.messageID);
        } else {
            return api.sendMessage('Failed to generate voice.', event.threadID, event.messageID);
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage('Failed to generate voice.', event.threadID, event.messageID);
    }
};
