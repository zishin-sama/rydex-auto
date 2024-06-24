const axios = require('axios');

module.exports.config = {
    name: 'ai2',
    version: "1.4.0",
    role: 0,
    credits: 'Aze Kagenou',
    description: 'Query GPT-4o for a response.',
    aliases: ['gpt4o'],
    hasPrefix: true,
    cooldown: 5
};
module.exports.run = async (api, event, args) => {
        const input = args.join(' ');

        if (!iprompt) {
            api.sendMessage('Please provide a prompt.', event.threadID, event.messageID);
            return;
        }

        try {
            const response = await axios.get(`https://ruiapi.onrender.com/api/gpt4o?q=${encodeURIComponent(prompt)}`);
            const output = response.data.message;

            api.sendMessage(output, event.threadID, event.messageID);
        } catch (error) {
            console.error('Error querying GPT-4:', error);
            api.sendMessage('An error occurred while processing your request. Please try again later.', event.threadID, event.messageID);
        }
    };
