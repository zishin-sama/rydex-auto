const axios = require("axios");

module.exports.config = {
  name: "sim",
  version: "1.0.0"
};
module.exports.handleEvent = async function({ api, event }) {
  if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) {
    const content = encodeURIComponent(event.body);
    try {
      const res = await axios.get(`https://simsimi.site/api/v2/?mode=talk&lang=ph&message=${content}&filter=false`);
      api.sendMessage(res.data.success, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  }
};