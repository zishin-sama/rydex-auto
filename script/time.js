module.exports.config = {
  name: "time",
  description: "Get the current time in Manila, Philippines.",
  aliases: ["what time is it?"],
  credits: "aze kagenou",
  cooldown: 5
};  
module.exports.run = async function({api, event}) {
    const now = new Date();
    const options = { timeZone: 'Asia/Manila', hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const formattedTime = now.toLocaleString('en-US', options);
    api.sendMessage(formattedTime, event.threadID, event.messageID);
    };