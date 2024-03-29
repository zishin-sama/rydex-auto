const { RsnChat } = require("rsnchat");

const rsnchat = new RsnChat("rsnai_q6XwhE3xUtjjW3SwxiO5xq9o");

module.exports.config = {
		name: "gpt4",
		version: "1.0.0",
		role: 0,
	  aliases: ["Gpt4"],
		credits: "cliff",
		hasPrefix: false,
		description: "Ask GPT-4 a question.",
		usage: "<question>",
		cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
		const question = args.join(" ");
		if (!question) return api.sendMessage("Please provide a question.", event.threadID);

		rsnchat.gpt(question).then((response) => {
				api.sendMessage(response.message, event.threadID);
		}).catch((error) => {
				api.sendMessage("An error occurred while processing your request.", event.threadID);
				console.error(error);
		});
};
