module.exports.config = {
	name: "shoti",
	version: "1.0.0",
	role: 0,
	credits: "libyzxy0",
	description: "Generate a random tiktok video.",
	usage: "{prefix}shoti",
	cooldown: 0,
	hasPrefix: true,
};

module.exports.run = async ({ api, event, args }) => {

	api.setMessageReaction("⏳", event.messageID, (err) => {
		 }, true);
api.sendTypingIndicator(event.threadID, true);

	const { messageID, threadID } = event;
	const fs = require("fs");
	const axios = require("axios");
	const request = require("request");
	const prompt = args.join(" ");

	if (!prompt[0]) { api.sendMessage("Sending...", threadID, messageID);
		}

 try {
	const response = await axios.post(`https://shoti-srv1.onrender.com/api/v1/get`, { apikey: `$shoti-1hg4gifgnlfdmeslom8` });

	let path = __dirname + `/cache/shoti.mp4`;
	const file = fs.createWriteStream(path);
	const rqs = request(encodeURI(response.data.data.url));
	rqs.pipe(file);
	file.on(`finish`, () => {
		 setTimeout(function() {
			 api.setMessageReaction("✅", event.messageID, (err) => {
					}, true);
			return api.sendMessage({
			body: `Username : @${response.data.data.user.username}\nNickname : ${response.data.data.user.nickname}`, 
			attachment: fs.createReadStream(path)
		}, threadID);
			}, 5000);
				});
	file.on(`error`, (err) => {
			api.sendMessage(`Error: ${err}`, threadID, messageID);
	});
	 } catch (err) {
		api.sendMessage(`Error: ${err}`, threadID, messageID);
	};
};