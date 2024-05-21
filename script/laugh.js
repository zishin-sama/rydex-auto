module.exports.config = {
	name: 'laugh',
	version: '1.0.0',
	role: 0,
	credits: 'Ychilli.',
	hasPrefix: false,
	description: 'Responds to laughter with a predefined message',
	usages: '',
	cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
	const laughterPatterns = /(haha|he|hi|ho|hu|lol|rofl|HAHAHAHA|lmao|😂|🤣|kek|lel)/i;
	const message = `HAPPY? CHAT MO CREATOR KO ETO fb link: https://www.facebook.com/kaizu.ui`;

	if (laughterPatterns.test(event.body)) {
		try {
			await api.sendMessage(message, event.threadID, event.messageID);
		} catch (error) {
			console.error('Error in laugh command:', error);
			api.sendMessage('An error occurred while processing the command.', event.threadID, event.messageID);
		}
	}
};
