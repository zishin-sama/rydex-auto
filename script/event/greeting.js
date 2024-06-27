const { api } = require("../handleEvent");

async function sendGreeting(message) {
  try {
    const threadList = await api.getThreadList(100, null, ["INBOX"]);
    threadList.forEach(thread => {
      if (thread.isGroup) {
        const threadName = thread.name || "Unnamed Group";
        const greeting = message.replace("{groupName}", threadName);
        api.sendMessage(greeting, thread.threadID);
      }
    });
  } catch (error) {
    console.error('Failed to get Thread List:', error);
  }
}

module.exports = {
  sendGreeting,
};