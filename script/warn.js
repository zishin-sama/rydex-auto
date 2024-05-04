module.exports.config = {
    name: "warn",
    version: "1.0.0",
    role: 0,
    credits: "ChatGPT",
    description: "Warn a user in the group chat",
    hasPrefix: false,
    usage: "[@user]",
    cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID, senderID } = event;
    const adminID = "100087212564100"; // UID ng admin
    const botID = api.getCurrentUserID();
    
    // Check kung si admin ba ay nag-warn
    if (senderID !== adminID) {
        return api.sendMessage("You are not authorized to use this command.", threadID, messageID);
    }

    // Check kung may user na na-mention
    if (!args[0]) {
        return api.sendMessage("Please mention the user you want to warn.", threadID, messageID);
    }

    const userID = args[0].replace("@", "").replace(" ", ""); // Kunin ang UID ng user na na-mention

    // Perform warn
    try {
        // Gagawin ang warning action dito (hal. i-send ang warning message sa user)
        await api.sendMessage(`You have been warned by the admin. This is your first warning.`, userID);
        return api.sendMessage(`User has been warned successfully.`, threadID, messageID);
    } catch (error) {
        return api.sendMessage(`Failed to warn user.`, threadID, messageID);
    }
};
