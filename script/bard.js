const axios = require('axios');

module.exports.config = {
		name: "bard",
		version: "1.0.0",
		credits: "dipto",
	role: 0,
		description: "Get a response from gemini AI",
	hasPrefix: false,
		usages: "[prompt]",
		cooldown: 5,
		aliases: ["gem"]
};

module.exports.run = async ({ api, event, args }) => {
		const prompt = args.join(" ");
	api.setMessageReaction("📝", event.messageID, () => { }, true);

		if (!prompt) {
				return api.sendMessage("Hello there, how can I assist you today?", event.threadID, event.messageID);
		}

		try {
				const response = await axios.get(`https://gemini-d1p.onrender.com/dipto?prompt=${prompt}`);
				const di = response.data.dipto; 
				api.setMessageReaction("✅", event.messageID, () => { }, true);

				api.sendMessage(`${di}`, event.threadID, event.messageID);
		} catch (error) {
				console.error('ERROR', error.response?.data || error.message);
				api.sendMessage('An error occurred while processing the command.', event.threadID);
		}
};