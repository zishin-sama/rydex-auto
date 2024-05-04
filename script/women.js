module.exports.config = {
    name: "women",
    version: "1.0.0",
    role: 0,
    credits: "ChatGPT",
    description: "Send a video of women",
    hasPrefix: true,
    usage: "",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const videoLink = "https://i.imgur.com/z47Hvel.mp4";

    // Send video
    await api.sendMessage({
        body: "women ☕",
        attachment: request(videoLink)
    }, threadID, () => {
        api.setMessageReaction("❤️", messageID);
    });
};
