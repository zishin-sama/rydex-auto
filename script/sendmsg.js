module.exports.config = {
    name: "sendMessage",
    aliases: ["send", "anonmsg"],
    version: "1.0",
    credits: "rydex",
    description: "Send an anonymous message to a specified thread or user using their ID.",
    usage: "Use: {p}sendMessage <userid> <message>",
    hasPrefix: true,
    cooldown: 5
};

module.exports.run = async function ({ api, event, args }) {
    if (args.length < 2) {
        api.sendMessage("Invalid format. Usage: {p}sendMessage <userid> <message>", event.threadID, event.messageID);
        return;
    }

    const recipientId = args[0];
    const messageContent = args.slice(1).join(" ");

    try {
        const userInfo = await api.getUserInfo(recipientId);
        const recipientName = userInfo[recipientId] ? userInfo[recipientId].name : "Unknown User";

        const randomIdentifier = Math.random().toString(36).substring(2, 10);

        const anonymousMessage = `𝗦𝗢𝗠𝗘𝗢𝗡𝗘 𝗦𝗘𝗡𝗧 𝗔 𝗠𝗘𝗦𝗦𝗔𝗚𝗘\n\n𝗧𝗼: ${recipientName}\n𝗠𝗲𝘀𝘀𝗮𝗴𝗲: ${messageContent}\n𝗙𝗿𝗼𝗺: ${randomIdentifier}`;
        const confirmationMessage = `Your message has been sent anonymously to ${recipientName}`;

        await api.sendMessage(anonymousMessage, recipientId);
        await api.sendMessage(confirmationMessage, event.threadID, event.messageID);

    } catch (error) {
        api.sendMessage(`Failed to send the message. Error: ${error.message}`, event.threadID, event.messageID);
    }
};
