module.exports.config = {
		name: "gpt4",
		version: "1.0.0",
		role: 0,
		credits: "Aze",
		hasPrefix: true,
		description: "AI-powered responses GPT-4. by g4f lib",
		usage: "[prompt]",
		cooldown: 0,
	    aliases: ["g4"]
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

				const messages = [
						{ role: "user", content: input }
				];
				const options = {
						provider: g4f.providers.GPT,
						model: "gpt-4",
						debug: true,
						proxy: ""
				};
				const response = await g4f.chatCompletion(messages, options);
				reply(response);
		} catch (e) {
				return reply(e.message);
		}
}
