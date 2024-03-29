const path = require('path');
const fs = require('fs');
const axios = require('axios');

module.exports.config = {
	name: "codm",
	version: "5",
	role: 0,
	hasPrefix: false,
	credits: "Eugene Aguilar",
	description: "generate random codm vids",
	aliases: ["cod"],
	usage: "codm",
	cooldown: 4,
};

module.exports.run = async function ({ api, event }) {
const { sendMessage: reply } = api;

	try {
		reply(`⏰ | Video is being sent, please wait...`, event.threadID, event.messageID);

		const pp = await axios.post(`https://codm-rbwc.onrender.com/link`);
		const hh = pp.data.link;
		const link = hh[Math.floor(Math.random() * hh.length)];

		const dl = await axios.get(`https://www.tikwm.com/api/?url=${link}`);
		const username = dl.data.data.author.unique_id || "Anonymous";
		const nickname = dl.data.data.author.nickname || "Anonymous";
		const title = dl.data.data.title || "N/A";
		const v = dl.data.data.play;

		const stream = await axios.get(v, { responseType: "arraybuffer" });

		let filePath = path.join(__dirname, 'cache', 'codm.mp4');
		fs.writeFileSync(filePath, Buffer.from(stream.data, 'binary'));

		await  reply({
			body: `Call of Duty Mobile 💫\n\nUsername: @${username}\nNickname: ${nickname}\nDescription: ${title}`,
			attachment: fs.createReadStream(filePath),
		}, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
	} catch (e) {
		console.error(e);
		reply(`Error fetching Call of Duty Mobile. Contact https://www.facebook.com/localhost.dev09 to fix this API!!`, event.threadID, event.messageID);
	}
};