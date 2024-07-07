module.exports.config = {
    name: "setnameall",
    version: "1.0.0",
    role: 0,
    description: "Set nickname for all participants in the thread.",
    usage: "[nickname]",
    hasPrefix: true,
    aliases: [],
    cooldown: 5,
    credits: "Aze"
};

module.exports.run = async function({ api, args, event }) {
    try {
        const threadInfo = await api.getThreadInfo(event.threadID);
        const participants = threadInfo.participantIDs;
        const newName = args.join(" ");

        for (let participantID of participants) {
            await api.changeNickname(event.threadID, participantID, newName);
        }

        return api.sendMessage(`Nicknames set to ${newName} for all participants.`, event.threadID);
    } catch (error) {
        console.error(error);
        return api.sendMessage("An error occurred while setting nicknames.", event.threadID);
    }
};