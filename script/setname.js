module.exports.config = {
  name: "setname",
  version: "1.0.0",
  hasPrefix: true,
  credits: "Aze Kagenou",
  aliases: ["sn"],
  description: "change name of thread",
  cooldown: 5,
  role: 0
  usage: "setname name",
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;
  const newTitle = args.join(" ");

  if (!newTitle) {
    api.sendMessage("Please provide a new group chat name.", threadID, messageID);
    return;
  }

  try {
    await api.setTitle(newTitle, threadID);
    api.sendMessage(`Group chat name set to "${newTitle}" successfully.`, threadID);
  } catch (err) {
    api.sendMessage(`Failed to set group chat name.`, threadID);
  }
};
