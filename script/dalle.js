const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: 'dalle',
    version: '1.0.0',
    role: 0,
    hasPrefix: false,
    credits: 'churchill',
    description: 'Generate image using DALL-E AI',
    usage: 'dalle [prompt]',
    cooldown: 5
};

module.exports.run = async function({ api, event, args }) {
    const apiUrl = "https://deku-rest-api.replit.app/dalle";
    
    try {
        const prompt = args.join(" ");
        if (!prompt) {
            api.sendMessage("Please provide a prompt.", event.threadID, event.messageID);
            return;
        }

        const response = await axios.get(`${apiUrl}?prompt=${encodeURIComponent(prompt)}`, { responseType: 'arraybuffer' });

        if (response.status === 200) {
            api.sendMessage({ attachment: response.data }, event.threadID, event.messageID);
        } else {
            api.sendMessage("Failed to generate image.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing your request.", event.threadID, event.messageID);
    }
};
