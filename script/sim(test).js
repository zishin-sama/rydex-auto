module.exports.config = {
    name: "sim",
    version: "1.0.0",
    role: 0,
    aliases: ["Sim"],
    credits: "jerome",
    description: "Talk to sim",
    cooldown: 0,
    hasPrefix: false
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    let { messageID, threadID, senderID, body } = event;
    const tid = threadID;
    const mid = messageID;
    const sid = senderID;
    const content = encodeURIComponent(args.join(" "));

    // messageReply function to reply to senderID
    function messageReply(message) {
        api.sendMessage(message, tid, (error, info) => {
            if (error) {
                console.error(error);
            }
        }, mid);
    }

    if (!args[0]) return messageReply("Please type a message...");

    try {
        const res = await axios.get(`https://sim-api-ctqz.onrender.com/sim?query=${content}`);
        const respond = res.data.respond;
        if (res.data.error) {
            messageReply(`Error: ${res.data.error}`);
        } else {
            messageReply(respond);
        }
    } catch (error) {
        console.error(error);
        messageReply("An error occurred while fetching the data.");
    }
};
