module.exports.config = {
  name: "approve",
  version: "1.0",
  role: 1,
  description: "Approve threads",
  aliases: [],
  usage: "approve",
  hasPrefix: true,
  credits: "Aze Kagenou",
  cooldown: 0
};

module.exports.run = async function ({ api, args, event }) {
        const list = [
            ...(await api.getThreadList(1, null, ['PENDING'])),
            ...(await api.getThreadList(1, null, ['OTHER'])),
        ];
        if (list[0]) {
            list.forEach(thread => {
                api.sendMessage('Congrats! This thread has been approved by admin. You can now use the bot, type `help all` to see all commands. Thank you for using my bot. -Aze', thread.threadID);
            });
           api.sendMessage("Threads Accepted Successfully.", event.threadID, event.messageID);
        } else {
            api.sendMessage("There are no pending thread requests.", event.threadID, event.messageID);
    }
};