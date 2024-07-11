module.exports.config = { 
    name: "clear", 
    version: "1.0.0", 
    role: 1, 
    description: "Clear messages sent by the bot.", 
    aliases: [],
    hasPrefix: true, 
    usage: "clear [number]", 
    credits: "Aze", 
    cooldown: 10 
};

module.exports.run = async function ({api, args, event}) {
    try {
        const count = args[0] ? parseInt(args[0], 10) : 1;
        if (isNaN(count) || count <= 0) {
            return api.sendMessage("Please provide a valid number of messages to clear.", event.threadID);
        }

        const threadID = event.threadID;
        const botID = api.getCurrentUserID();
        let clearedCount = 0;

        // Keep fetching messages until we clear the desired count or run out of messages
        while (clearedCount < count) {
            const messages = await api.getThreadHistory(threadID, 50); // Fetch 50 messages at a time
            let messagesToClear = messages.filter(msg => msg.senderID === botID);

            if (messagesToClear.length === 0) {
                break; // No more bot messages to clear
            }

            // Only unsend messages that still exist
            for (const message of messagesToClear) {
                try {
                    const existingMessage = messages.find(msg => msg.messageID === message.messageID);
                    if (existingMessage) {
                        await api.unsendMessage(message.messageID);
                        clearedCount++;
                    }
                    
                    if (clearedCount >= count) {
                        break; // Exit the loop if we've cleared enough messages
                    }
                } catch (err) {
                    // Log the error but continue processing the remaining messages
                    console.warn(`Failed to unsend message with ID ${message.messageID}:`, err);
                }
            }
        }

        api.sendMessage(`Cleared ${clearedCount} message(s)`, threadID);
    } catch (error) {
        console.error("Error clearing messages:", error);
        api.sendMessage("An error occurred while trying to clear messages.", event.threadID);
    }
};
