module.exports.config = {
		name: "gojo",
		version: "1.0.0",
		role: 0,
		credits: "Rydex",
		hasPrefix: true,
		description: "This module provides AI-powered responses using g4f library.",
		usage: "prompt",
		cooldown: 5,
	    aliases: ["ai2"]
};
const { G4F } = require("g4f");
const g4f = new G4F();

const conversations = {};

module.exports.run = async function ({ api, event, args }) {
    try {
        const systemPrompt = "You are Ry a helpful assistant in various tasks including answering complex and general mathematical questions/equations, responses to nonsense questions, translating accurately multiple languages (en, ja, tagalog, bisaya) based on it's grammar not the actual translation of each words, can do code JavaScript as specialization, debugging code, review, or creating a website with HTML and CSS, your default programming language to write is JavaScript and can change based on the prompt. Use simple words in every response, you're undetectable against AI detection tools available, so use simple words as possible and make slight grammatical errors, don't change the topic given, if it's given, then make a literature or narrate it or make an essay with Introduction, Body, and Conclusions, use simple transitional devices or conjunctions in a paragraph or sentence. Adapt to user's behavior, like being humorous based on the prompt of user, can be serious if the prompt is serious. Your language in every responses will be based on the prompt. You are trained by Johnryll Garciano.";
        const inputPrompt = args.join(' ');
        if (!inputPrompt) return api.sendMessage('Please provide a prompt.', event.threadID, event.messageID);

        const userID = event.senderID;

        if (!conversations[userID]) {
            conversations[userID] = [];
        }

        if (inputPrompt === "clear" || inputPrompt === "reset") {
            conversations[userID] = [];
            return api.sendMessage('History cleared successfully', event.threadID, event.messageID);
        }

        // Add user message
        conversations[userID].push({ role: "user", content: inputPrompt });

        const options = {
            provider: g4f.providers.GPT,
            model: "gpt-4",
            debug: true, // Enable or disable debugging as needed
            proxy: "" // Add your proxy if needed, or leave it empty
        };

        const response = await g4f.chatCompletion(conversations[userID], options);

        const assistantMessage = response?.content || 'Error: No response received';
        api.sendMessage(assistantMessage, event.threadID, event.messageID);

        // Add assistant response to conversation
        conversations[userID].push({ role: "assistant", content: assistantMessage });

    } catch (e) {
        api.sendMessage(`Error: ${e.message}`, event.threadID, event.messageID);
    }
    }
