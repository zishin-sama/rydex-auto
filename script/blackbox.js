const ax = require('axios');
module.exports.config = {
	name: "blackbox",
	version: "1.0.0",
	role: 0,
	description: "Chat with BlackboxAI (Conversational)",
	aliases: ["bb"],
	hasPrefix: true,
	usage: "{n}prompt",
	credits: "rydex|api by josh",
	cooldown: 5
}
module.exports.run = async ({api, args, event}) => {
	function reply(a) {
		api.sendMessage(a, event.threadID, event.messageID);
	}
	const uid = event.senderID;
	const prompt = encodeURIComponent(args.join(" "));
	
	if (!prompt) return reply("Please provide a prompt");
	
	try {
		const url = `https:\/\/deku-rest-api.gleeze.com/api/blackboxai?q=${prompt}&uid=${uid}`;
		const res = await ax.get(url);
		const d = res.data.result;
		return reply(d);
		
	}
	catch (e) {
		return reply(e.message);
	}
}