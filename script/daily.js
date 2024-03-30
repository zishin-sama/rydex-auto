const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: "daily",
	credits: "Jonell Magallanes",
	role: 0,
	description: "Allows a user to receive daily currency",
	aliases: ["dai"],
	usage: "bank",
	cooldown: 24, 
	hasPrefix: false,
};

module.exports.run = async function({ api, event }) {
	const userId = event.senderID;
	const userDataFile = path.join(__dirname, '/cache/currencies.json');
	let userData = JSON.parse(fs.readFileSync(userDataFile, { encoding: 'utf8' }));

	if (!userData[userId]) {
		userData[userId] = { balance: 0, lastDaily: null };
	}

	const now = new Date();
	const lastDaily = new Date(userData[userId].lastDaily);
	const diff = now - lastDaily;
	const cooldown = 24 * 60 * 60 * 1000;

	if (diff < cooldown) {
		const remaining = cooldown - diff;
		const hours = Math.floor(remaining / (60 * 60 * 1000));
		const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));
		const seconds = Math.floor((remaining % (60 * 1000)) / 1000);
		api.sendMessage(`You need to wait for ${hours} hours, ${minutes} minutes and ${seconds} seconds to use the bank command again.`, event.threadID);
		return;
	}

	userData[userId].balance += 100;
	userData[userId].lastDaily = now.toISOString();

	fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));

	api.sendMessage(`💸 | You have received $100! Your new balance is $${userData[userId].balance}.`, event.threadID);
};
