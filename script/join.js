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
    if (!args[0]) {
      const groupList = await api.getThreadList(10, null, ['INBOX']);
      const filteredList = groupList.filter(group => group.threadName !== null);

      if (filteredList.length === 0) {
        api.sendMessage('No group chats found.', event.threadID);
      } else {
        const formattedList = filteredList.map((group, index) =>
          `│${index + 1}. ${group.threadName}\n│TID: ${group.threadID}\n│Total members: ${group.participantIDs.length}\n│`
        );
        const message = `List of group chats:\n${formattedList.map(line => `${line}`).join("\n")}\n\nMaximum Members = 250\n\nTo join on the group, reply to this message\n\nExample: ${prefix}join 1234567891001234`;

        const sentMessage = await api.sendMessage(message, event.threadID);
        // global.GoatBot.onReply.set(sentMessage.messageID, {
        //   commandName: 'join',
        //   messageID: sentMessage.messageID,
        //   author: event.senderID,
        // });
      }
    } else {
      const threadID = args[0];

      // If threadID is provided, try to join the group
      const selectedGroup = await api.getThreadInfo(threadID);

      if (!selectedGroup) {
        api.sendMessage('Invalid thread ID. Please provide a valid group chat ID.', event.threadID);
        return;
      }

      // Check if the user is already in the group
      const memberList = await api.getThreadInfo(threadID);
      if (memberList.participantIDs.includes(event.senderID)) {
        api.sendMessage(`Can't add you, you are already in the group chat: \n${selectedGroup.threadName}`, event.threadID);
        return;
      }

      // Check if group is full
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