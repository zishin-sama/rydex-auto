const axios = require("axios");

module.exports.config = {
		name: "claude",
		version: "1.0.0",
		credits: "dipto",
		role: 0,
		description: "",
		hasPrefix: false,
		usage: "{claude} [query]", // Corrected the placeholder name
		cooldown: 5,
		aliases: []
};

module.exports.run = async function ({ api, event, args }) {
		const { threadID, messageID } = event;

		if (args.length < 1) {
				api.sendMessage("🔍|Please provide a question for Claude AI.", threadID, messageID);
				return;
		}

		try {
				const query = args.join(" "); // Corrected the variable name to 'query'
				api.sendMessage(`Please wait a moment while I process your request: ${query}`, threadID, messageID);

				const response = await axios.get(`https://hazee-claude-ai-5b3176a38696.herokuapp.com/claude?q=${encodeURIComponent(query)}`);

				const responseText = response.data.response[0].text; // Extracting the response text from the API data
				api.sendMessage(responseText, threadID, messageID); // Sending the response text to the chat
		} catch (error) {
				console.error(error);
				api.sendMessage("An error occurred while fetching the response.", threadID, messageID);
		}
};
