module.exports.config = {
	name: "coinflip",
	version: "1.0.0",
	role: 0,
	credits: "Cliff",
	description: "Simulate a coin toss with a betting system",
	hasPrefix: false,
	aliases: ["flip"],
	usages: "[heads/tails] [amount]",
	cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies }) {
	const { threadID, messageID } = event;
	const betChoice = args[0]?.toLowerCase();
	const betAmount = parseInt(args[1]);

	if (!betChoice || !['heads', 'tails'].includes(betChoice))
		return api.sendMessage("Invalid option. Use flip [heads/tails] [amount]", threadID, messageID);

	if (isNaN(betAmount) || betAmount <= 0)
		return api.sendMessage("Please enter a valid bet amount.", threadID, messageID);

	if (betAmount > 10000)
		return api.sendMessage("The maximum bet amount is 10,000 coins.", threadID, messageID);

	const currentMoney = await Currencies.getData(event.senderID).then(data => data.money);
	if (betAmount > currentMoney)
		return api.sendMessage(`You do not have enough coins to bet. Your current balance is ${currentMoney} coins.`, threadID, messageID);

	const result = Math.random() < 0.5 ? 'heads' : 'tails';
	const win = betChoice === result;

	if (win) {
		const reward = betAmount * 1.7;
		await Currencies.increaseMoney(event.senderID, reward);
		return api.sendMessage(`🪙 You won ₪${reward} with a result of ${result}!`, threadID, messageID);
	} else {
		await Currencies.decreaseMoney(event.senderID, betAmount);
		return api.sendMessage(`🪙 You lost ₪${betAmount} with a result of ${result}!`, threadID, messageID);
	}
};
