module.exports.config = {
    name: "clear",
    version: "1.0.0",
    role: 1,
    description: "Clear messages sent by the bot.",
    aliases: [],
    usage: "clear [number]",
    credits: "",
    cooldown: 10
};

module.exports.run = async function ({api, args, event}) {
    const count = args[0] ? parseInt(args[0]) : 1;

    const threadID = event.threadID;
    
    const messages = await api.getThreadHistory(threadID, count + 1); 
    
    const botMessages = messages.filter(msg => msg.senderID === api.getCurrentUserID());
    
    if(botMessages.length > 0) {
        const messagesToClear = botMessages.slice(0, count);

        for(const message of messagesToClear) {
            await api.unsendMessage(message.messageID);
        }

        api.sendMessage(`Cleared ${messagesToClear.length} messages.`, event.threadID);
    } else {
        api.sendMessage("No messages to clear.", event.threadID);
    }
};