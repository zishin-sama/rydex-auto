const axios = require('axios');

module.exports.config = {
	name: "box",
	version: "1",
	role: 0,
	hasPrefix: true,
	usage: "{prefix}box <prompt>",
	credits: "Eugene Aguilar",
	description: "blackbox AI",
	aliases: [],
	cooldowns: 0,
};

module.exports.run = async function ({api, event, args}) {
	if (!args[0]) {
		api.sendMessage("Please provide a prompt.", event.threadID, event.messageID);
		return;
	}

	const query = encodeURIComponent(args.join(" "));
	const apiUrl = `https://deku-rest-api-ywad.onrender.com/blackbox?prompt=${query}`;

	try {
		const response = await axios.get(apiUrl);
		const ans = response.data.response;
		api.sendMessage(ans, event.threadID, event.messageID);
	} catch (error) {
		console.error("Error:", error);
		api.sendMessage("An error occurred while fetching the response.", event.threadID, event.messageID);
	}
};
