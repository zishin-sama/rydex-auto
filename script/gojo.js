const { get } = require('axios');

module.exports.config = {
 name: "gojo",
 version: "1.0.0",
 role: 0,
 aliases: ["goj"],
 credits: "cliff",
 cooldown: 0,
 hasPrefix: false,
 usage: "",
};

module.exports.run = async function ({ api, event, args }) {
 const prompt = args.join(' ');
 const id = event.senderID;

 function sendMessage(msg) {
	api.sendMessage(msg, event.threadID, event.messageID);
 }

 const url = "https://deku-rest-api.replit.app";

 if (!prompt) return sendMessage("Missing input!\n\nIf you want to reset the conversation with " + this.config.name + " you can use '" + this.config.name + " clear'");
 sendMessage("🔍 | wait...");

 try {
	const response = await get(`${url}/llama-70b?prompt=${encodeURIComponent(prompt)}&personality=gojo`);
	sendMessage(response.data.result);
 } catch (error) {
	sendMessage(error.message);
 }
};
