const fs = require("fs");
const request = require("request");

module.exports.config = {
    name: "women",
    version: "1.0.0",
    role: 0,
    credits: "churchill",
    description: "Send a video of women",
    hasPrefix: true,
    usage: "",
    cooldowns: 5
};

module.exports.run = async function ({ api, event }) {
    const { threadID, messageID } = event;
    const link = [
        "https://i.imgur.com/z47Hvel.mp4",
        // Dito mo ilalagay ang mga iba pang mga links ng video
    ];

    // Pumili ng isang random na link mula sa listahan
    const randomIndex = Math.floor(Math.random() * link.length);
    const videoLink = link[randomIndex];

    // Padala ng video
    await api.sendMessage({
        body: "women ☕",
        attachment: request(videoLink)
    }, threadID, () => {
        api.setMessageReaction("☕", messageID);
    });
};
