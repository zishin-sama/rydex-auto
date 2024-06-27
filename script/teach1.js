module.exports.config = {
    name: "teach1",
    version: "1.0.0",
    role: 0,
    hasPrefix: true,
    aliases: [],
    credits: "KENLIEPLAYS",
    description: "Teach Simsimi",
    usage: "[ask] | [answer]",
    cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    let { messageID, threadID, senderID, body } = event;
    let tid = threadID,
    mid = messageID;
    const input = args.join(" ").split("|");

    if (input.length < 2) {
        if(args.length == 0){
            return api.sendMessage("Usage: teach [ask] | [answer]", tid, mid);
        } else if(args.join(" ").includes("|")) {
            return api.sendMessage("Please provide both a question and an answer.", tid, mid);
        } else {
            return api.sendMessage("Please use '|' character to separate the question and answer.", tid, mid);
        }
    }

    const ask = encodeURIComponent(input[0].trim());
    const answer = encodeURIComponent(input[1].trim());

    try {
        const res = await axios.get(`https://simsimi.site/api/v2/?mode=teach&lang=ph&message=${ask}&answer=${answer}`);
        const respond = res.data.success;
        if (res.data.error) {
            api.sendMessage(`Error: ${res.data.error}`, tid, (error, info) => {
                if (error) {
                    console.error(error);
                }
            }, mid);
        } else {
            api.sendMessage(respond, tid, (error, info) => {
                if (error) {
                    console.error(error);
                }
            }, mid);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching the data.", tid, mid);
    }
};