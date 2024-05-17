const axios = require('axios');

module.exports.config = {
    name: "axis",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "chilli",
    description: "Interact with Axis AI",
    commandCategory: "Utilities",
    usages: "[query]",
    cooldowns: 5,
};

module.exports.run = async function({ api, event, args }) {
    const query = args.join(" ");
    
    if (!query) {
        return api.sendMessage("Please provide a query to send to Axis AI.", event.threadID, event.messageID);
    }

    const apiUrl = `https://liaspark.chatbotcommunity.ltd/myai?u=LianeAPI_Reworks&id=axis&query=${encodeURIComponent(query)}`;

    try {
        const response = await axios.get(apiUrl);
        const data = response.data;

        if (data && data.reply) {
            api.sendMessage(data.reply, event.threadID, event.messageID);
        } else {
            api.sendMessage("Sorry, I couldn't get a response from Axis AI.", event.threadID, event.messageID);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while processing your request. Please try again later.", event.threadID, event.messageID);
    }
};
