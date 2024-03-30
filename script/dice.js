const path = require('path');
const fs = require('fs');

const userDataFile = path.join(__dirname, '/cache/currencies.json');

const rollDie = (sides = 6) => Math.floor(Math.random() * sides) + 1;

const numberToEmoji = (roll) => {
	const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
	return diceEmojis[roll - 1];
};

module.exports.config = {
	name: "dice",
	version: "1.0.0",
	role: 0,
	credits: "Yazky",
	hasPrefix: false,
	description: "Roll one or more virtual dice",
	usages: "dice [maxBet]",
	cooldowns: 5
};

module.exports.run = async ({ api, event, args }) => {
	const threadID = event.threadID;
	const messageID = event.messageID;
	const maxBet = 17000;
	const betAmount = parseInt(args[0]) || 0;

	if (isNaN(betAmount) || betAmount < 0 || betAmount > maxBet) {
		return api.sendMessage(`Invalid bet amount. Please enter a number between 0 and ${maxBet}.`, threadID, messageID);
	}

	let userData = JSON.parse(fs.readFileSync(userDataFile, { encoding: 'utf8' }));
	const userId = event.senderID;

	if (!userData[userId]) {
		userData[userId] = { balance: 0 };
	}

	const userBalance = userData[userId].balance;

	if (userBalance < betAmount) {
		return api.sendMessage(`Insufficient balance. Your current balance is ₪${userBalance}.`, threadID, messageID);
	}

	const userRoll = rollDie();
	const botRoll = rollDie();
	let resultMessage = `You got: ${numberToEmoji(userRoll)}\nYazkybot got: ${numberToEmoji(botRoll)}\n\n`;

	if (userRoll > botRoll) {
		resultMessage += `You won ₪${betAmount} with a result of ${userRoll}`;
		userData[userId].balance += betAmount;
	} else if (botRoll > userRoll) {
		resultMessage += `You lost ₪${betAmount} with a result of ${userRoll}`;
		userData[userId].balance -= betAmount;
	} else {
		resultMessage += `Both of you were tied with a result of ${userRoll}`;
	}

	fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));

	api.sendMessage(resultMessage, threadID, messageID);
};
