const axios = require('axios');

module.exports.config = {
		name: "gemma",
		version: "1.0.0",
		role: 0,
		credits: "hazey",
		description: "EDUCATIONAL",
		hasPrefix: false,
		usages: "",
		cooldown: 5,
		aliases: ["ai88", "ai99"],
};

module.exports.run = async function ({ api, event, args }) {
		const content = encodeURIComponent(args.join(" "));

		if (!content) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", event.threadID, event.messageID);

		const apiUrl = `https://haze-ai-models-8d44a842ac90.herokuapp.com/gemma?content=${content}&key=CutieHazeyy`;

		try {
				api.sendMessage("🔍 | gemma is searching for your answer. Please wait...", event.threadID, event.messageID);

				const response = await axios.get(apiUrl);
				const { data } = response;

				if (data && data.choices && data.choices.length > 0 && data.choices[0].message && data.choices[0].message.content) {
						const content = data.choices[0].message.content;
						api.sendMessage(content, event.threadID, event.messageID);
				} else {
						api.sendMessage("An error occurred while processing your request.", event.threadID);
				}
		} catch (error) {
				console.error(error);
				api.sendMessage("🔨 | An error occurred while processing your request from API...", event.threadID);
		}
};
