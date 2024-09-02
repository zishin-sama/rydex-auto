const getGPT4js = require("gpt4js");
module.exports.config = {
	name: "ai2",
	version: "1.2.7",
	role: 0,
	description: "Chat with AI",
	hasPrefix: false,
	aliases: [],
	credits: "rydex",
	usage: "prompt",
	cooldown: 5,
};
async function initializeGPT4js() {
  const GPT4js = await getGPT4js();
}
module.exports.run = async function ({api, args, event}) {
    const GPT4js = await getGPT4js();
	function reply(a) {
		api.sendMessage(a, event.threadID, event.messageID);
	}
	const prompt = args.join(" ");
	if (!prompt) return reply("Please provide a prompt");
	
	await initializeGPT4js();
	
    const messages = [
        { role: "system", content: "God-like genius and all knowing" },
        { role: "user", content: prompt }
    ];

    const options = { provider: "ChatBotRu", model: "gpt-4o", webSearch: true, temperature: 0.1 };

    const provider = GPT4js.createProvider(options.provider);

    try {
        const data = await provider.chatCompletion(messages, options);
        reply(data);
    } catch (e) {
        return reply(e.message);
    }
};