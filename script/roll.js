module.exports.config = {
	name: 'roll',
	version: '1.0.0',
	hasPermision: 0,
	credits: 'chill',
	usePrefix: true,
	description: 'Roll a six-sided die and get a random number between 1 and 6',
	commandCategory: 'fun',
	usages: '',
	cooldowns: 5
};

module.exports.run = async ({ api, event }) => {
	
	const rollDie = () => Math.floor(Math.random() * 6) + 1;

	
	const result = rollDie();

	
	const message = `🎲 You rolled a die and got a ${result}!`;

	
	try {
		await api.sendMessage(message, event.threadID, event.messageID);
	} catch (error) {
		console.error('Error in roll command:', error);
		api.sendMessage('An error occurred while processing the command.', event.threadID, event.messageID);
	}
};
