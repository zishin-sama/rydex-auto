module.exports.config = {
	name: 'laugh',
	version: '1.0.0',
	hasPermision: 0,
	credits: 'tite',
	usePrefix: false,
	description: 'mag automatic mag send pag may tumawa',
	commandCategory: 'fun',
	usages: '',
	cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
	const laughterPatterns = /(ha|he|hi|ho|hu|lol|rofl|lmao|😂|🤣)/i;
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
