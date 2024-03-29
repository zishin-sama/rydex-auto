const fs = require('fs');
const axios = require('axios');

module.exports.config = {
	name: "t",
	version: "1.0.0",
	credits: "Eugene",
	role: 0,
	description: "Download TikTok videos",
	hasPrefix: false,
	usages: "tik video <link>\ntik audio <link>",
	cooldown: 5,
	aliases: ["t"],
};

module.exports.run = async function ({ api, event, args, prefix }) {
	if (!args[0] || (args[0] !== "video" && args[0] !== "audio")) {
		return api.sendMessage(`Invalid command. Usage: ${prefix}tik video <link>\n${prefix}tik audio <link>`, event.threadID, event.messageID);
	}

	const mediaType = args[0];
	const path = `${__dirname}/cache/tik.${mediaType === "video" ? "mp4" : "mp3"}`;
	const url = args[1];

	try {
		api.sendMessage(`Downloading ${mediaType === "video" ? "video" : "audio"}, please wait...`, event.threadID, event.messageID);
		const response = await axios.get(`https://eurix-api.replit.app/api/tiktokdl/tools?link=${url}`);
		const { url: mediaUrl, title = "undefined", username = "undefined", nickname = "undefined" } = response.data;

		const mediaResponse = await axios.get(mediaUrl, { responseType: 'stream' });
		const writer = fs.createWriteStream(path);

		mediaResponse.data.pipe(writer);

		writer.on('finish', function () {
			api.sendMessage({ body: `Downloaded Successfully.\nTitle: ${title}\nUsername: ${username}\nNickname: ${nickname}`, attachment: fs.createReadStream(path) }, event.threadID, event.messageID);
		});
	} catch (error) {
		console.error("Error downloading TikTok media:", error);
		api.sendMessage("Failed to download TikTok media. Please check the provided link.", event.threadID, event.messageID);
	}
};
