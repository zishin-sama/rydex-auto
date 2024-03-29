const axios = require('axios');

module.exports.config = {
		name: "tiksr",
		version: "1.0.0",
		credits: "Samir Œ , Faith Xe",
		hasPrefix: false,
		role: 0,
		description: "Send a random TikTok video",
		aliases: [],
		usage: "{prefix}tiksr <query>",
		cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
		const query = args.join(" ");

		if (!query) {
				return api.sendMessage("Please provide a query for TikTok videos.", event.threadID);
		}

		try {
				const apiUrl = `https://api-samir.onrender.com/search/tiktok`;
				const response = await axios.post(apiUrl, { query });
				const videos = response.data.videos;

				if (videos.length === 0) {
						return api.sendMessage("No TikTok videos found for the given query.", event.threadID);
				}

				const randomVideo = videos[Math.floor(Math.random() * videos.length)];

				const videoStream = await axios.get(randomVideo);
				const attachment = { body: videoStream.data, type: 'stream', isURL: true };

				return api.sendMessage({ attachment }, event.threadID);
		} catch (error) {
				console.error(error);
				return api.sendMessage("An error occurred while fetching TikTok videos.", event.threadID);
		}
};
