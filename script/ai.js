const axios = require('axios');

module.exports.config = {
    name: "ai",
    version: 1.0,
    credits: "Churchill",
    description: "AI",
    hasPrefix: false,
    usages: "{ai} [question]",
    aliases: [],
    cooldown: 0,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const question = args.join(" ");
        if (!question) {
            await api.sendMessage("Hey, I'm your virtual assistant. Ask me a question.", event.threadID);
            return;
        }

        const response = await axios.get(`https://haze-llm-model-74e9fe205264.herokuapp.com/snow?question=${encodeURIComponent(question)}`);
        const answer = response.data.answer;

        if (answer === undefined || answer === null) {
            await api.sendMessage("Sorry, I couldn't find an answer to that question.", event.threadID);
        } else {
            await api.sendMessage(`${answer}\nThe bot was created by Churchill: https://www.facebook.com/Churchill.Dev4100`, event.threadID);
        }
    } catch (error) {
        console.error("Error:", error.message);
    }
};
