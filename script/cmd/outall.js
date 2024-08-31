module.exports.config = { 
    name: "outall", 
    version: "1.0.0", 
    role: 1, 
    hasPrefix: true, 
    credits: "Developer", 
    aliases: ["lv"], 
    description: "Bot leaves all threads", 
    usage: "outall", 
    cooldown: 10, 
}; 

module.exports.run = async function({ api, event, args, admin }) { 
    try { 
        const threadList = await api.getThreadList(99, null, ["INBOX"]); 
        for (const thread of threadList) { 
            await api.sendMessage("bye guys loveu all", thread.threadID);
            await api.removeUserFromGroup(api.getCurrentUserID(), thread.threadID); 
        } 
            api.sendMessage("Left to all threads successfully.", event.threadID); 
    } catch (error) { 
        api.sendMessage(error.message, event.threadID, event.messageID); 
    } 
};