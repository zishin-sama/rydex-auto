module.exports.config = {
  name: "dsc",
  version: "1.2.7",
  role: 0,
  description: "Chat with DeepSeek Coder AI",
  hasPrefix: false,
  aliases: [],
  credits: "rydex",
  usage: "prompt",
  cooldown: 5,
};

async function initializeGPT4js() {
	const getGPT4js = require("gpt4js");
    const GPT4js = await getGPT4js();
}

module.exports.run = async function ({ api, args, event }) {
  function reply(a) {
    api.sendMessage(a, event.threadID, event.messageID);
  }

  const prompt = args.join(" ");
  if (!prompt) return reply("Please provide a prompt");

  await initializeGPT4js();

  const messages = [
    { role: "system", content: "Programming genius" },
    { role: "user", content: prompt }
  ];

  const options = {
    provider: "Alibaba",
    model: "deepseek-coder",
    codeModelMode: true,
    temperature: 0.1
  };

  const provider = GPT4js.createProvider(options.provider);

  try {
    const data = await provider.chatCompletion(messages, options);
    reply(data);
  } catch (e) {
    return reply(e.message);
  }
};