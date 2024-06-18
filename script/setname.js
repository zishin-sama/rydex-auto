"use strict";

module.exports.config = {
  name: "setname",
  hasPrefix: true,
};

module.exports.run = async function({ api, event, args }) {
  try {
    // Check if the command has sufficient arguments
    if (args.length < 2) {
      api.sendMessage("Usage: /setname @mention or uid <new nickname>", event.threadID);
      return;
    }

    // Extract the mentioned user or UID and the new nickname
    const mention = Object.keys(event.mentions)[0];
    let participantID = mention || args.shift();
    const newNickname = args.join(" ");

    if (!participantID || !newNickname) {
      api.sendMessage("Please provide a valid user mention or UID and a new nickname.", event.threadID);
      return;
    }

    // If a UID is provided, validate it in the thread
    if (!mention) {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const userIdsInThread = threadInfo.participantIDs;

      if (!userIdsInThread.includes(participantID)) {
        api.sendMessage("The provided UID is not in this thread.", event.threadID);
        return;
      }
    }

    // Change the nickname using the provided API
    await api.changeNickname(newNickname, event.threadID, participantID);

    // Send a confirmation message
    api.sendMessage("Nickname changed successfully!", event.threadID);
  } catch (err) {
    // Send an error message if changing the nickname fails
    api.sendMessage("Failed to change nickname: " + err.message, event.threadID);
  }
};
