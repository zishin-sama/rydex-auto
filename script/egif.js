const axios = require('axios');

module.exports.config = {
    name: "emoji2gif",
    version: "1.0.0",
    credits: "RAUL",
    role: 0,
    description: "Convert emoji to GIF",
    hasPrefix: false,
    usage: "{pn} emoji",
    cooldown: 5,
    aliases: ["egif"],
};

module.exports.run = async function ({ api, args, event }) {
    const emoji = encodeURIComponent(args.join(" "));

    const apiUrl = `https://joshweb.click/emoji2gif?q=${emoji}`;

    try {
        const response = await axios.get(apiUrl);

        if (response && response.data) {
            return api.sendMessage({ attachment: response.data }, event.threadID, event.messageID);
        } else {
            return api.sendMessage('Failed to convert emoji to GIF.', event.threadID, event.messageID);
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage('Failed to convert emoji to GIF.', event.threadID, event.messageID);
    }
};
