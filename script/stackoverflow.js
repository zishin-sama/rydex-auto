const axios = require('axios');

module.exports.config = {
    name: "stackoverflow",
    version: "1.0.0",
    credits: "Samir Œ , Faith Xe",
    hasPrefix: false,
    role: 0,
    description: "Search for a question on Stack Overflow",
    aliases: ["stack"],
    usage: "{prefix}stackoverflow <search query>",
    cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {
    const searchQuery = args.join(' ');
    if (!searchQuery) {
        return api.sendMessage('Please provide a search query.', event.threadID, event.messageID);
    }

    try {
        const apiUrl = `https://api-samir.onrender.com/stackoverflow/search?q=${encodeURIComponent(searchQuery)}`;
        const response = await axios.get(apiUrl);

        const items = response.data.items;
        if (!items || items.length === 0) {
            return api.sendMessage('No results found on Stack Overflow.', event.threadID, event.messageID);
        }

        const selectedResult = items[Math.floor(Math.random() * items.length)];

        const ownerInfo = selectedResult.owner;
        const profileImage = ownerInfo.profile_image;

        // Function to get stream from URL
        const getStreamFromURL = async (url) => {
            const response = await axios.get(url, { responseType: 'stream' });
            return response.data;
        };

        const message = {
            body: `🌳 𝙎𝙩𝙖𝙘𝙠 𝙊𝙫𝙚𝙧𝙛𝙡𝙤𝙬 𝙍𝙚𝙨𝙪𝙡𝙩𝙨𝐬 \n` +
                `─────────────────\n` +
                `📌 𝐓𝐢𝐭𝐥𝐞: ${selectedResult.title}\n\n` +
                `🏷 𝐓𝐚𝐠𝐬: ${selectedResult.tags.join(', ')}\n\n` +
                `👀 𝐕𝐢𝐞𝐰 𝐂𝐨𝐮𝐧𝐭: ${selectedResult.view_count}\n\n` +
                `👤 𝐃𝐢𝐬𝐩𝐥𝐚𝐲 𝐍𝐚𝐦𝐞: ${ownerInfo.display_name}\n\n` +
                `💬 𝐀𝐧𝐬𝐰𝐞𝐫 𝐂𝐨𝐮𝐧𝐭: ${selectedResult.answer_count}\n\n` +
                `📅 𝐂𝐫𝐞𝐚𝐭𝐢𝐨𝐧 𝐃𝐚𝐭𝐞: ${new Date(selectedResult.creation_date * 1000).toLocaleString()}\n\n` +
                `🔄 𝐋𝐚𝐬𝐭 𝐀𝐜𝐭𝐢𝐯𝐢𝐭𝐲 𝐃𝐚𝐭𝐞: ${new Date(selectedResult.last_activity_date * 1000).toLocaleString()}\n\n` +
                `⭐ 𝐒𝐜𝐨𝐫𝐞: ${selectedResult.score}\n\n` +
                `✅ 𝐀𝐜𝐜𝐞𝐩𝐭 𝐑𝐚𝐭𝐞: ${ownerInfo.accept_rate ? ownerInfo.accept_rate + '%' : 'N/A'}\n\n` +
                `🔗 𝐋𝐢𝐧𝐤: ${selectedResult.link}`,
            attachment: await getStreamFromURL(profileImage)
        };

        return api.sendMessage(message, event.threadID, event.messageID);
    } catch (error) {
        console.error(error);
        return api.sendMessage('An error occurred while searching on Stack Overflow.', event.threadID, event.messageID);
    }
};
