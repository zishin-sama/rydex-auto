const axios = require("axios");
const fs = require('fs');

module.exports = {
  config: {
    name: "ginfo",
    version: "1.0.0",
    role: 0,
    description: "Retrieve information about the current group chat.",
    commandCategory: "Group Chat",
    usages: "",
    cooldowns: 5,
    hasPrefix: false
  },
  run: async function({ api, event, args }) {
    try {
      const groupInfo = await api.getThreadInfo(event.threadID);

      const info = `
        Ｇｒｏｕｐ Ｉｎｆｏ

Name: ${groupInfo.threadName}
No. Admin: ${groupInfo.adminIDs.length}
Approval Mode: ${groupInfo.approvalMode}
Members: ${groupInfo.participantIDs.length}
Message Sent: ${groupInfo.messageCount}
      `;

      api.sendMessage(info, event.threadID);
    } catch (error) {
      console.error("Error retrieving group chat information", error);
      api.sendMessage('An error occurred while retrieving group chat information.\nPlease try again later.', event.threadID);
    }
  },
};
