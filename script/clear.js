module.exports.config = { 
name: "clear", 
version: "1.0.0", 
role: 1, 
description: "Clear messages sent by the bot.", 
aliases: [],
hasPrefix: true, 
usage: "clear [number]", 
credits: "Aze", 
cooldown: 10 };
module.exports.run = async function ({api, args, event}) {
    const count = args[0] ? parseInt(args[0]) : 1;
    const threadID = event.threadID;
    const messages = await api.getThreadHistory(threadID, Infinity); // Retrieve all messages in the thread
    const botMessages = messages.filter(msg => msg.senderID === api.getCurrentUserID());

    if (botMessages.length > 0) {
        const messagesToClear = botMessages.slice(0, count);
        for (const message of messagesToClear) {
            await api.unsendMessage(message.messageID);
        }

        api.sendMessage(`Cleared ${messagesToClear.length === 1 ? "1 message" : `${messagesToClear.length} messages`}`, event.threadID);
    } else {
        api.sendMessage("No messages to clear.", event.threadID);
    }
};