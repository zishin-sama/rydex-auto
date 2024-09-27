const ax = require('axios');
module.exports.config = {
	name: "blackbox",
	version: "1.0.0",
	role: 0,
	description: "Chat with BlackboxAI (Conversational)",
	aliases: ["bbox"],
	hasPrefix: true,
	usage: "{n}prompt",
	credits: "Rydex",
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
		await api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
    
    await api.sendTypingIndicator(event.threadID, true); 
    
		const url = `https:\/\/deku-rest-api.gleeze.com/api/blackboxai?q=${prompt}&uid=${uid}`;
		const res = await ax.get(url);
		const d = res.data.result;
		await api.setMessageReaction("✅", event.messageID, (err) => {}, true);
		return reply(d);
		
	}
	catch (e) {
		await api.setMessageReaction("❌", event.messageID, (err) => {}, true);
		return reply(e.message);
	}
}
