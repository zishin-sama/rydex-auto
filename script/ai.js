/* 
If you encounter any errors, please give me feedback. Contact me on facebook https://facebook.com/joshg101
*/

const { get } = require('axios');
let url = "https://deku-rest-api.replit.app";

module.exports.config = {
	name: "Ai",
	version: "1.0.0",
	role: 0,
	hasPrefix: false,
	credits: "Deku",
	description: "Talk to AI with continuous conversation.",
	aliases:  [],
	usages: "[prompt]",
	cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
	function sendMessage(msg) {
		api.sendMessage(msg, event.threadID, event.messageID);
	}

	if (!args[0]) return sendMessage('Please provide a question first.');

	const prompt = args.join(" ");

	try {
		const response = await get(`${url}/gpt3?prompt=${encodeURIComponent(prompt)}&uid=${event.senderID}`);
		const data = response.data;
		return sendMessage(data);
	} catch (error) {
		return sendMessage(error.message);
	}
}
