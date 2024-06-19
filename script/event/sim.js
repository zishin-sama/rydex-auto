
const axios = require("axios");

module.exports.config = {
  name: "autosim",
  version: "1.0.0"
};

module.exports.handleEvent = async function({ api, event }) {
  if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) {
    const q = encodeURIComponent(event.body);
    try {
      const { data } = await axios.get(`https://sim-api-ctqz.onrender.com/sim?query=${q}`);
      api.sendMessage(data.respond, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  }
};
