"use strict";

module.exports.config = {
  name: "gcinfo",
  hasPrefix: true,
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, messageID } = event;
  const targetThreadID = args[0];

  if (!targetThreadID) {
    api.sendMessage("Please provide a thread ID.", threadID, messageID);
    return;
  }

  try {
    const threadInfo = await api.getThreadInfoGraphQL(targetThreadID);
    if (!threadInfo) {
      api.sendMessage(`Thread with ID ${targetThreadID} not found.`, threadID, messageID);
      return;
    }

    // Format the thread info for display
    const infoText = formatThreadInfo(threadInfo);

    // Send the thread info to the user
    api.sendMessage(infoText, threadID, messageID);
  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, threadID, messageID);
  }
};

function formatThreadInfo(threadInfo) {
  // Format the thread info for display
  let infoText = `Thread ID: ${threadInfo.threadID}\n`;
  infoText += `Thread Name: ${threadInfo.threadName}\n`;
  infoText += `Participant Count: ${threadInfo.participantIDs.length}\n`;
  infoText += `Unread Count: ${threadInfo.unreadCount}\n`;
  // Add more details as needed
  return infoText;
}
