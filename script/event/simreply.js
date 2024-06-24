const axios = require("axios");
module.exports.config = {
    name: "sim",
    version: "1.0.0"
};
module.exports.handleEvent = async function({ api, event }) {
	const query = event.body;
    try {
        if (event.type === "message_reply") {
        if (event.senderID === event.messageReply.senderID) {
        	return;
        }
     }
        const response = await axios.get('https://sim-api-ctqz.onrender.com/sim?query=${encodeURIComponent(query)}');
            api.sendMessage(response.data, event.threadID, event.messageID);
    } catch (error) {
        console.error("An error occurred:", error);
    }
};
