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
        const groupList = await api.getThreadList(100, null, ["INBOX"], (err, list) => {
            list.forEach((group, index) => {
                if (group.isGroup && group.isSubscribed) {
                    const formattedGroup = `│${index + 1}. ${group.threadName}\n│TID: ${group.threadID}\n│Total members: ${group.participantIDs.length}\n│`;
                    api.sendMessage(formattedGroup, event.threadID);
                }
            });
        });

        if (args.length === 0) {
            api.sendMessage('To join a group, reply with the group number. Example: join 1', event.threadID);
        } else {
            const groupNumber = parseInt(args[0]);
            if (groupNumber < 1 || groupNumber > groupList.length) {
                api.sendMessage('Invalid group number. Please select a valid group number.', event.threadID);
                return;
            }

            const selectedGroup = groupList[groupNumber - 1];
            if (selectedGroup.participantIDs.includes(event.senderID)) {
                api.sendMessage(`You are already a member of this group: ${selectedGroup.threadName}`, event.threadID);
                return;
            }

            if (selectedGroup.participantIDs.length >= 250) {
                api.sendMessage(`Cannot add you to the group. It is full: ${selectedGroup.threadName}`, event.threadID);
                return;
            }

            await api.addUserToGroup(event.senderID, selectedGroup.threadID);
            api.sendMessage(`You have joined the group chat: ${selectedGroup.threadName}`, event.threadID);
        }
    } catch (error) {
        console.error("Error joining group chat", error);
        api.sendMessage('An error occurred while joining the group chat. Please try again later.', event.threadID);
    }
};