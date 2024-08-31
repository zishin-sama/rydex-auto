module.exports.config = { 
  name: "uid", 
  role: 0, 
  credits: "Mirai Team", 
  description: "Get the user's Facebook UID.", 
  hasPrefix: true, 
  usages: "{p}uid {p}uid @mention", 
  cooldown: 5, 
  aliases: [] 
};

module.exports.run = async function({ api, event, args }) {
  let target = args[0];
  
  if (!target) {
    if (event.messageReply) {
      const senderID = event.messageReply.senderID;
      return api.sendMessage(senderID, event.threadID);
    } else {
      return api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);
    }
  }
  
  if (event.mentions.length === 0) {
    if (target.startsWith("https://facebook.com")) {
      const res = await api.getUserID(target);
      api.sendMessage(`${res}`, event.threadID, event.messageID);
    } else {
      return api.sendMessage("Invalid input. Please provide a valid Facebook URL.", event.threadID);
    }
  } else {
    for (const mentionID in event.mentions) {
      const mentionName = event.mentions[mentionID];
      api.sendMessage(`${mentionName.replace('@', '')}: ${mentionID}`, event.threadID);
    }
  }
};