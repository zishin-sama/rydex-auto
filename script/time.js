module.exports.config = {
  name: "time",
  description: "Get the current time in Manila, Philippines.",
  aliases: [],
  role: 0,
  credits: "aze kagenou",
  hasPrefix: false,
  cooldown: 5
};  
module.exports.run = async function({api, event}) {
    const now = new Date();
    const options = { timeZone: 'Asia/Manila', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = now.toLocaleString('en-US', options);
    api.sendMessage(`The current time is: ${formattedTime}`, event.threadID, event.messageID);
    };
