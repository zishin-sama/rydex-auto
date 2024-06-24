module.exports.config = {
  name: "uid",
  version: "1.0.1",
  role: 0,
  credits: "Aze Kagenou",
  description: "Get the user's Facebook UID.",
  hasPrefix: true,
  usage: "uid / @mention/profile url",
  cooldown: 5,
  aliases: []
};

module.exports.run = async function({ api, event, args }) {
  if (Object.keys(event.mentions).length === 0) {
    if (event.messageReply) {
      const senderID = event.messageReply.senderID;
      return api.sendMessage(senderID, event.threadID);
    } else {
      return api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);
    }
  } else {
    for (const mentionID in event.mentions) {
      const mentionName = event.mentions[mentionID];
      api.sendMessage(`${mentionName.replace('@', '')}: ${mentionID}`, event.threadID);
    }
    let mentions = [];
let includeEveryone = false;

if (participantsPart === "@everyone") {
  includeEveryone = true;
} else {
  mentions = Object.keys(event.mentions);
}

if (includeEveryone) {
  const threadInfo = await api.getThreadInfo(event.threadID);
  
  let allParticipantIDs = await api.getUserID(event.threadID);
  mentions = allParticipantIDs;
  
  api.sendMessage(`All UserIDs\n\n${mentions}`, event.threadID);
}
    
    const profileURL = args[0];
    
    if (validProfileURL(profileURL)) {
      const userID = await api.getUserID(profileURL);
      if (userID) {
        api.sendMessage(`${userID}`, event.threadID);
      }
    } else {
      api.sendMessage("Invalid profile link format.", event.threadID);
    }
  }
};

function validProfileURL(url) {
    const urlPattern = `^(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:\w+\/)?(?:profile\.php\?id=)?(?:\d+|[a-zA-Z0-9.]+)(?:\?.*)?$`;
    const match = url.match(urlPattern);
    
    if (match) {
        return match[1];
    } else {
        return false;
    }
}