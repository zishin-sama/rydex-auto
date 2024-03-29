const axios = require('axios');

module.exports.config = {
	name: "token",
	version: "1.0.0",
	role: 0,
	hasPrefix: false,
	credits: "Eugene Aguilar",
	description: "Get token from Facebook API",
	usage: "/token username: <username> password: <password>",
	cooldowns: 6,
};

module.exports.run = async function ({ api, event, args }) {
	try {
		const [username, password] = args; 
		if (!username || !password) { 
			return api.sendMessage("Please enter a username and password", event.threadID, event.messageID);
		}

		api.sendMessage(`Getting token, please wait...`, event.threadID, event.messageID);

		const response = await axios.get(`https://hiroshi-rest-api.replit.app/facebook/token?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`);
		const token = response.data.data.access_token_eaad6v7
const tokensecond = response.data.data.access_token
const cookie = response.data.data.cookies

	api.sendMessage(`here's your token: ${token}\nsecondary: ${tokensecond}\nCookies: ${cookie}`, event.threadID, event.messageID);

	} catch (error) {
		console.error(error);
		api.sendMessage("An error occurred while getting the token", event.threadID, event.messageID);
	}
};