const axios = require("axios");
const http = require('http');

// Create an Axios instance with Keep-Alive enabled
const axiosInstance = axios.create({
  httpAgent: new http.Agent({ keepAlive: true })
});

module.exports.config = {
  name: "sim",
  version: "1.0.0"
};

module.exports.handleEvent = async function({ api, event }) {
  // Check the conditions before encoding the query
  if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) {
    const q = encodeURIComponent(event.body);
    try {
      // Use the Axios instance with Keep-Alive for the API request
      const { data } = await axiosInstance.get(`https://sim-api-ctqz.onrender.com/sim?query=${q}`);
      // Send the response message without unnecessary parameters
      api.sendMessage(data.respond, event.threadID, event.messageID);
    } catch (error) {
      console.error("Error fetching response:", error);
    }
  }
};
