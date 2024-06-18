const axios = require("axios");

module.exports.config = {
  name: "sim",
  version: "1.0.0"
};

module.exports.handleEvent = async function({ api, event }) {
  if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) {
    try {
      const query = encodeURIComponent(event.body);
      const res = await axios.get(`https://sim-api-ctqz.onrender.com/sim?query=${query}`);
      const respond = res.data.respond;
      
        api.sendMessage(respond, event.threadID, event.messageID);
    } catch (error) {
      console.error(error);
      api.sendMessage("An error occurred while fetching the data.", event.threadID, event.messageID);
    }
  }
};
