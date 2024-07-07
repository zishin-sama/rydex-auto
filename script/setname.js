module.exports.config = {
  name: "setname",
  version: "1.0.0",
  role: 0,
  description: "Set nickname of sender or the user replied to.",
  usage: "[new nickname]",
  hasPrefix: true,
  aliases: [],
  cooldown: 0,
  credits: "Aze Kagenou",
};

module.exports.run = async function({ api, args, event }) {
  if (event.type !== "message_reply") {
    const nickname = args.join(" ");
    if (!nickname) return api.sendMessage("Please provide a nickname.", event.threadID);
    
    await api.changeNickname(event.senderID, nickname);
    api.sendMessage(`Changed nickname to "${nickname}".`, event.threadID);
  } else {
    const repliedTo = event.messageReply.senderID;
    const nickname = args.join(" ");
    if (!nickname) return api.sendMessage("Please provide a nickname.", event.threadID);
    
    await api.changeNickname(repliedTo, nickname);
    api.sendMessage(`Changed nickname to "${nickname}".`, event.threadID);
  }
};