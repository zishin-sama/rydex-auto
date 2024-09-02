const axios = require('axios');
module.exports.config = {
	name: "quote",
	version: "1.0.0",
	role: 0,
	description: "Fetch quotes from ZenQuotes",
	aliases: [],
	hasPrefix: true,
	usage: "{n}",
	cooldown: 5
};
module.exports.run = async function ({ api, args, event }) {
    try {
        const api_url = 'https://zenquotes.io/api/quotes';
        const response = await axios.get(api_url);
        const data = response.data;
        
        if (data.length > 0) {
            const { q, a } = data[0];
            api.sendMessage(`${q}\n\n- ${a}`);
        } else {
            api.sendMessage('No quotes found at the moment.');
        }
    } catch (error) {
        console.error('Error fetching quotes:', error);
        api.sendMessage('An error occurred while fetching quotes.');
    }
};