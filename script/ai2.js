module.exports.config = {
		name: "ai2",
		version: "1.0.0",
		role: 0,
		credits: "Rydex",
		hasPrefix: true,
		description: "This module provides AI-powered responses using g4f library.",
		usage: "prompt",
		cooldown: 5,
	    aliases: []
};
const { G4F } = require("g4f");
const g4f = new G4F();

const conversations = {};

module.exports = async function ({ api, event, args }) {
    try {
        const inputPrompt = args.join(' ');
        if (!inputPrompt) return api.sendMessage('Please provide a prompt.', event.threadID, event.messageID);

        const userID = event.senderID;
        const userMessage = { role: "user", content: inputPrompt };

        if (!conversations[userID]) {
            conversations[userID] = [userMessage];
        }
        else if (inputPrompt === "clear" || inputPrompt === "reset") {
        	conversations[userID] = [];
        api.sendMessage('History cleared successfully', event.threadID, event.messageID);
        } else {
            conversations[userID].push(userMessage);
        }

        const options = {
            provider: g4f.providers.GPT,
            model: "gpt-4",
            debug: true,
            proxy: ""
        };

        const response = await g4f.chatCompletion(conversations[userID], options);

        api.sendMessage(response, event.threadID, event.messageID);

        conversations[userID].push({ role: "assistant", content: response });

    } catch (e) {
        api.sendMessage(e.message, event.threadID, event.messageID);
    }
}