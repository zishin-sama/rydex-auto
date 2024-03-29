const axios = require('axios');
const fs = require('fs');

module.exports.config = {
		name: "pyg",
		version: "1.0.0",
		role: 0,
		credits: "hazey",
		description: "EDUCATIONAL",
		hasPrefix: false,
		usages: "",
		cooldown: 5,
		aliases: ["llma"],
};

module.exports.run = async function ({ api, event, args }) {
		const content = encodeURIComponent(args.join(" "));

		if (!content) return api.sendMessage("Please provide the text to convert to Pygmalion.", event.threadID, event.messageID);

		const apiUrl = `https://haze-ai-models-8d44a842ac90.herokuapp.com/pygmalion?content=${content}`;

		try {
				api.sendMessage("🔍 | Pygmalion is converting your text. Please wait...", event.threadID, event.messageID);

				const response = await axios.get(apiUrl);
				const content = response.data.choices[0].message.content;

				if (content) {
						api.sendMessage(content, event.threadID, event.messageID);
				} else {
						api.sendMessage("An error occurred while processing your request.", event.threadID);
				}
		} catch (error) {
				console.error(error);
				api.sendMessage("🔨 | An error occurred while processing your request from API...", event.threadID);
		}
};
