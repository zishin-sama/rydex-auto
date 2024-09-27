module.exports.config = {
    name: "gpt",
    version: "1.0.0",
    role: 0,
    credits: "Rydex",
    hasPrefix: true,
    description: "AI-powered responses GPT-4.",
    usage: "[prompt]",
    cooldown: 0,
    aliases: ["ai"]
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { G4F } = require("g4f");

        function reply(a) {
            api.sendMessage(a, event.threadID, event.messageID);
        }

        const g4f = new G4F();
        
        const input = args.join(' ');
        if (!input) return reply('Please provide a prompt.');

        // Set loading reaction first
        await api.setMessageReaction("⏳", event.messageID, (err) => {
            if (err) console.error("Error setting reaction ⏳:", err);
        }, true);

        // Indicate that the bot is typing
        api.sendTypingIndicator(event.threadID, true); 

        const messages = { role: "user", content: input };
        const options = {
            provider: g4f.providers.GPT,
            model: "gpt-4",
            debug: true,
            proxy: ""
        };

        // Await the AI response
        const response = await g4f.chatCompletion(messages, options);

        // If there’s no response or an error, set the failure reaction
        if (!response) {
            throw new Error("No response from AI");
        }

        // Set success reaction after receiving the response
        await api.setMessageReaction("✅", event.messageID, (err) => {
            if (err) console.error("Error setting reaction ✅:", err);
        }, true);

        // Stop typing indicator and send the response
        api.sendTypingIndicator(event.threadID, false); 
        reply(response);
        
    } catch (e) {
        // Set failure reaction if an error occurs
        await api.setMessageReaction("❌", event.messageID, (err) => {
            if (err) console.error("Error setting reaction ❌:", err);
        }, true);

        return reply(e.message);
    }
};
