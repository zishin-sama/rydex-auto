const axios = require('axios');
let enabled = false;
module.exports.config = {
    name: "sim",
    version: "1.0",
    role: 0,
    credits: "jerome",
    aliases: [],
    description: "Talk to sim",
    hasPrefix: true,
    usage: "[ask]",
    cooldown: 2,
};

module.exports.run = async function({ api, event, args }) {
        const content = encodeURIComponent(args.join(" "));
        
        if (!args[0]) return api.sendMessage("Please type a message...", event.thread, event.messageID);

        try {
            const res = await axios.get(`https://sim-api-ctqz.onrender.com/sim?query={content}`);
        api.sendMessage(res.data.success, event.threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage("An error occurred while fetching the data.", event.threadID, event.messageID);
    }
    
if (!args[0] || !["on", "off"].includes(args[0])) {
    return api.sendMessage(`Use ${prefix}sim "on" or "off" to enable sim.`, event.thread, event.messageID);
    }
if (args[0] === "on") {
    enabled = true;
    api.sendMessage("Sim activated reply mode.", event.threadID);
  } else if (command === "off") {
    enabled = false;
    api.sendMessage("Sim deactivated reply mode.", event.threadID);
  }
},

module.exports.handleEvent = async function({ api, event }) {
  if (!enabled) {
  	return;
  }
  
  try {
    if (event.type === "message_reply") {
      if (event.senderID === event.messageReply.senderID) {
        return;
      }
    } 
    
    const response = await axios.get(`https://sim-api-ctqz.onrender.com/sim?query=${content}`);
    api.sendMessage(response.data, event.threadID, event.messageID);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
