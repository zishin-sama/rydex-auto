const { get } = require('axios');

const url = "https://liaspark.chatbotcommunity.ltd/myai";
const userId = "LianeAPI_Reworks";

module.exports.config = {
	name: "axis",
	version: "1.0.0",
	role: 0,
	hasPrefix: false,
	credits: "chill",
	description: "Generate a response using the Axis API",
	usages: "[prompt]",
	cooldown: 5,
	aliases: ["ax"]
};

module.exports.run = async function ({ api, event, args }) {
	function sendMessage(msg) {
		api.sendMessage(msg, event.threadID, event.messageID);
	}

	if (!args[0]) return sendMessage('Missing prompt!');

	const prompt = args.join(" ");
	if (!prompt) return sendMessage('Missing prompt!');

	try {
		const response = await get(`${url}?u=${userId}&id=axis&query=${encodeURIComponent(prompt)}`);

		if (response.status === 200) {
			return sendMessage(response.data);
		} else {
			return sendMessage("Failed to generate response.");
		}
	} catch (error) {
		console.error('Error:', error);
		return sendMessage("An error occurred while processing your request.");
	}
};
