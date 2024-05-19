module.exports.config = {
	name: 'laugh',
	version: '1.0.0',
	hasPermision: 0,
	credits: 'Ychilli.',
	usePrefix: false,
	description: 'Responds to laughter with a predefined message',
	commandCategory: 'fun',
	usages: '',
	cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
	const laughterPatterns = /(ha|he|hi|ho|hu|lol|rofl|lmao|😂|🤣|kek|lel)/i;
	const message = `HAPPY? CHAT MO CREATOR KO ETO fb link: https://www.facebook.com/Churchill.Dev4100`;

	if (laughterPatterns.test(event.body)) {
		try {
			await api.sendMessage(message, event.threadID, event.messageID);
		} catch (error) {
			console.error('Error in laugh command:', error);
			api.sendMessage('An error occurred while processing the command.', event.threadID, event.messageID);
		}
	}
};
