module.exports = {
  name: "uid",
  version: "1.0.1",
  role: 0,
  credits: "Aze Kagenou",
  description: "Get the user's Facebook UID.",
  hasPrefix: true,
  usage: "uid/ uid @mention/ uid profile url",
  cooldown: 5,
  aliases: []
};

const validProfileURL = (url) => {
  const urlPattern = /^(?:https?:\/\/)?(?:www\.)?facebook\.com\/(?:\w+\/)?(?:profile\.php\?id=)?(?:\d+|[a-zA-Z0-9.]+)(?:\?.*)?$/;
  const match = url.match(urlPattern);
  return match ? match[1] : false;
};

const run = async ({ api, event, args }) => {
  const mentionIDs = Object.keys(event.mentions);
  const participantsPart = event.participantIDs || event.mentions;

  if (mentionIDs.length === 0 && !args[0]) {
    if (event.messageReply) {
      const senderID = event.messageReply.senderID;
      return api.sendMessage(senderID, event.threadID);
    } else {
      return api.sendMessage(`${event.senderID}`, event.threadID, event.messageID);
    }
  }

  if (mentionIDs.length > 0) {
    for (const mentionID of mentionIDs) {
      const mentionName = event.mentions[mentionID];
      api.sendMessage(`${mentionName.replace("@", "")}: ${mentionID}`, event.threadID);
    }
  }

  if (args[0] && validProfileURL(args[0])) {
    const userID = await api.getUserID(args[0]);
    if (userID) {
      api.sendMessage(`${userID}`, event.threadID);
    } else {
      api.sendMessage("Invalid profile link format.", event.threadID);
    }
    return;
  }

  if (args[0] === "@everyone" || args[0] === "all") {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const allParticipantIDs = event.participantIDs || [];

    let namesAndUserIDs = "";
    for (const participantID of allParticipantIDs) {
      const userInfo = await api.getUserInfo(participantID);
      namesAndUserIDs += `${userInfo.name} - ${participantID}\n`;
    }

    api.sendMessage(namesAndUserIDs, event.threadID);
    return;
  }

  if (event.messageReply) {
    const senderID = event.messageReply.senderID;
    api.sendMessage(`${senderID}`, event.threadID);
  }
};