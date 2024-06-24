module.exports.config = {
	name: "changebio",
	version: "1.0.0",
    description: "Change your bot bio",
    role: 1,
    credits: "aze kagenou",
    hasPrefix: true,
    usage: "changebio [text]",
    aliases: ["cb"],
    cooldown: 10
};

module.exports.run = async function(api, event, args, commands) {
        const newBio = args.join(" ");

        api.changeBio(newBio, true)
            .then(() => {
                api.sendMessage("Set bot biography to: " + newBio, event.threadID, event.messageID);
            })
            .catch((err) => {
                api.sendMessage("Failed to update bio: " + err, event.threadID);
            });
    };