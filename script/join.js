module.exports.config = { 
  name: 'join',
  version: '1.0.0', 
  role: 0, 
  usage: "join", 
  credits: 'Kshitiz', 
  description: 'Join the specified group chat', 
  aliases: [], 
  hasPrefix: true, 
  cooldown: 0, 
}; 

module.exports.run = async function({ api, event, args }) {
  try {
    const groupList = await api.getThreadList(100, null, ["INBOX"]);

    if (args.length === 0) {
      if (groupList.length === 0) {
        api.sendMessage('No group chats found.', event.threadID);
      } else {
        const formattedList = groupList.map((group, index) => `│${index + 1}. ${group.threadName}\n│TID: ${group.threadID}\n│Total members: ${group.participantIDs.length}\n│`);
        const message = `List of group chats:\n${formattedList.map(line => `${line}`).join("\n")}\n\nMaximum Members = 250\n\nTo join a group, reply to this message with the group ID\n\nExample: join 1234567891001234`;
        const sentMessage = await api.sendMessage(message, event.threadID);
      }
    } else {
      const threadID = args[0];
      const selectedGroup = await api.getThreadInfo(threadID);
      
      if (!selectedGroup) {
        api.sendMessage('Invalid thread ID. Please provide a valid group chat ID.', event.threadID);
        return;
      }

      const memberList = await api.getThreadInfo(threadID);

      if (memberList.participantIDs.includes(event.senderID)) {
        api.sendMessage(`Can't add you, you are already in the group chat: \n${selectedGroup.threadName}`, event.threadID);
        return;
      }

      if (memberList.participantIDs.length >= 250) {
        api.sendMessage(`Can't add you, the group chat is full: \n${selectedGroup.threadName}`, event.threadID);
        return;
      }

      await api.addUserToGroup(event.senderID, threadID);
      api.sendMessage(`You have joined the group chat: ${selectedGroup.threadName}`, event.threadID);
    }

  } catch (error) {
    console.error("Error joining group chat", error);
    api.sendMessage('An error occurred while joining the group chat. Please try again later.', event.threadID);
  }
};