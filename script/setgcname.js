"use strict";

module.exports.config = {
  name: "setgcname",
  hasPrefix: true,
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
    api.sendMessage(`Failed to set group chat name: ${err.message}`, threadID);
  }
};
