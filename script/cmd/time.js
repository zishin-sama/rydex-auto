module.exports.config = {
  name: "time",
  version: "1.0.2",
  description: "Get the current time in Manila, Philippines.",
  role: 0,
  hasPrefix: true,
  aliases: ["wt"],
  usage: "time",
  credits: "aze kagenou",
  cooldown: 5
};  
module.exports.run = async function({api, event}) {
    const now = new Date();
    const options = { timeZone: 'Asia/Manila', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = now.toLocaleString('en-US', options);
    api.sendMessage(`The current time is: ${formattedTime}`, event.threadID, event.messageID);};