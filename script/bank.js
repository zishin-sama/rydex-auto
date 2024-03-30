const path = require('path');
const fs = require('fs');

module.exports.config = {
	name: "bal",
	credits: "Jonell Magallanes",
	description: "Allows a user to check their bank currency balance",
	role: 0,
	aliases: ["balance", "money", "bank"],
	usages: "bank",
	cooldowns: 5,
	hasPrefix: "enable"
};

module.exports.run = async function({ api, event, args }) {
		const userId = Object.keys(event.mentions).length === 0 ? event.senderID : Object.keys(event.mentions)[0];
		const userDataFile = path.join(__dirname, 'currencies.json');
		let userData = JSON.parse(fs.readFileSync(userDataFile, { encoding: 'utf8' }));

		if (!userData[userId]) {
			api.sendMessage("You do not have an account yet.", event.threadID);
			return;
		}

		const balance = userData[userId].balance || 0;
		let message;
		if (Object.keys(event.mentions).length > 0) {
			const mentionName = event.mentions[userId];
			message = `🏦 | Name: ${mentionName.replace('@', '')} \n\n━━━━━━━━━━━━━━━━━\n\nYour current balance is $${balance}.`;
		} else {
			message = `🏦 | Your current balance is $${balance}.`;
		}
	 api.sendMessage(message, event.threadID);
};
