async function getUserName(api, senderID) {
  try {
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID]?.name || "User";
  } catch (error) {
    console.log(error);
    return "User";
  }
}

module.exports.config = {
  name: "unblock",
  version: "•.•",
  role: 1,
  credits: "cliff",
  description: "Unblock a user",
  hasPrefix: true,
  aliases: ["unblock","unban"],
  usage: "{p}{n} @mention, reply, senderID",
  cooldown: 0
};
module.exports.run = async function({ api, event, args }) {
    const { mentions, messageReply, threadID, senderID, messageID } = event;
    const mentionID = args[0];

    if (event.type === "message_reply") {
      const replySenderID = messageReply.senderID;
      api.sendMessage("You have been unblocked.", replySenderID);
      api.sendMessage(`${await getUserName(api, replySenderID)} has been unblocked Successfully.`, threadID, messageID);
      api.changeBlockedStatus(replySenderID, false);
    } else {
      if (!mentionID) {
        return api.sendMessage(`Please mention the user you want to unblock.`, threadID, messageID);
      }
      api.sendMessage("You have been unblocked.", mentionID);
      api.sendMessage(`${await getUserName(api, mentionID)} has been unblocked Successfully.`, threadID, messageID);
      api.changeBlockedStatus(mentionID, false);
  }
};