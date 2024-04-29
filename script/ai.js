const { get } = require('axios');

module.exports.config = {
    name: "ai",
    version: "1.0.0",
    role: 0,
    hasPrefix: false,
    credits: "Deku",
    description: "Talk to AI with continuous conversation.",
    aliases:  [],
    usages: "[prompt]",
    cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    function sendMessage(msg) {
        api.sendMessage(msg, event.threadID, event.messageID);
    }

    if (!args[0]) return sendMessage('Please provide a question first.');

    const prompt = args.join(" ");
    const url = `https://deku-rest-api.replit.app/gpt4?prompt=${encodeURIComponent(prompt)}&uid=${event.senderID}`;

    try {
        const response = await get(url);
        const data = response.data;
        const botOwnerProfileLink = "https://www.facebook.com/Churchill.Dev4100"; // Replace this with the bot owner's Facebook profile link
        const messageWithLink = `${data.gpt4}\n𝐂𝐫𝐞𝐝𝐢𝐭𝐬 𝐭𝐨 𝐭𝐡𝐞 𝐛𝐨𝐭 𝐨𝐰𝐧𝐞𝐫: ${botOwnerProfileLink}`;
        return sendMessage(messageWithLink);
    } catch (error) {
        return sendMessage(error.message);
    }
}
