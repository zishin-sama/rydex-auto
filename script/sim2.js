const axios = require('axios');
let enabled = false;
module.exports.config = {
    name: "sim2",
    version: "2.0",
    role: 0,
    credits: "Aze Kagenou",
    aliases: [],
    description: "Talk to sim",
    hasPrefix: true,
    usage: "[ask]",
    cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
        const content = encodeURIComponent(args.join(" "));
        
        if (!args[0]) return api.sendMessage("Please type a message...", event.thread, event.messageID);

        try {
            const res = await axios.get(`https://simsimi.site/api/v2/?mode=talk&lang=ph&message=${content}&filter=true`);
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
    api.sendMessage("Sim activated", event.threadID);
  } else if (command === "off") {
    enabled = false;
    api.sendMessage("Sim deactivated", event.threadID);
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
    
    const response = await axios.get(`https://simsimi.site/api/v2/?mode=talk&lang=ph&message=${content}&filter=true`);
    api.sendMessage(response.data, event.threadID, event.messageID);
  } catch (error) {
    console.error("An error occurred:", error);
  }
};
