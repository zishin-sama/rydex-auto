const fs = require('fs');
const path = require('path');
const conversationsFilePath = path.join(__dirname, 'cache', 'conversations.json');
let conversations = {};

try {
    const data = fs.readFileSync(conversationsFilePath, 'utf8');
    conversations = JSON.parse(data);
} catch (err) {
    console.error('Error reading conversations file:', err);
}

module.exports.config = {
    name: "gpt4",
    version: "1.0.0",
    role: 0,
    credits: "Aze",
    hasPrefix: true,
    description: "AI-powered responses using GPT-4.",
    usage: "{n} [question]",
    cooldown: 0,
    aliases: ["g4"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { G4F } = require("g4f");
        const uid = event.senderID;

        function reply(a) {
            api.sendMessage(a, event.threadID, event.messageID);
        }

        const g4f = new G4F();
        const textInput = args.join(' ');

        if (args[0] === 'clear') {
            delete conversations[uid];
            saveConversations();
            return api.sendMessage('Conversations cleared!', event.threadID);
        }

        if (!conversations[uid]) {
            conversations[uid] = [];
        }

        const userConversations = conversations[uid] || [];
        const messages = userConversations.concat([{ role: "user", content: textInput }]);
        const options = { provider: g4f.providers.GPT, model: "gpt-4", debug: true, proxy: "" };

        const response = await g4f.chatCompletion.then(messages, options);

        conversations[uid] = userConversations.concat([{ role: "assistant", content: response }]);

        if (userConversations.length > 0 && userConversations[userConversations.length - 1].role === 'assistant') {
            reply(response); 
        }

        saveConversations();
    } catch (e) {
        return reply(e.message);
    }
};

function saveConversations() {
    fs.writeFileSync(conversationsFilePath, JSON.stringify(conversations, null, 2));
}