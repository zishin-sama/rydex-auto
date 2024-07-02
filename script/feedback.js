module.exports.config = {
    name: 'feedback',
    version: '1',
    role: 0,
    description: 'Send a message to the admin.',
    credits: 'aze',
    hasPrefix: true,
    usage: '{n} [message]',
    aliases: [],
    cooldown: 3
};
module.exports.run = async function({api, event, args, prefix, commands}) {
	    const name = (await api.getUserInfo(event.senderID))[event.senderID].name;
        const message = args.join(' ');
        const botAdminID = '100064714842032'; 

        if (!message) {
            api.sendMessage('Please provide a message to send.', event.threadID, event.messageID);
            return;
        }

        try {
            await api.sendMessage(`New message from ${name}:\n\n${message}`, botAdminID);
            api.sendMessage('Your message has been sent to the bot admin.', event.threadID, event.messageID);
        } catch (error) {
            console.error('Error sending message to bot admin:', error);
            api.sendMessage('An error occurred while sending your message. Please try again later.', event.threadID, event.messageID);
        }
    };
