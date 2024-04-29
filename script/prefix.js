const fs = require("fs");

module.exports.config = {
    name: "prefix",
    version: "1.0.1",
    role: 0,
    credits: "cliff",
    description: "Display the prefix of your bot",
    hasPrefix: false,
    usages: "prefix",
    cooldown: 5,
    aliases: ["prefix", "Prefix", "PREFIX", "prefi"],
};

module.exports.run = function ({ api, event, prefix, admin }) {
    const { threadID, messageID } = event;

    if (event.body.toLowerCase() === `${prefix}prefix`) {
        if (prefix === undefined) {
            api.sendMessage(
                "I don't have a prefix set.",
                threadID,
                messageID
            );
        } else {
            api.sendMessage(
                `My prefix is ${prefix}.`,
                threadID,
                messageID
            );
        }
        return;
    }

    if (event.body.toLowerCase().startsWith(prefix)) {
        // Rest of the code for handling commands
    }

    // If prefix is not set
    if (!prefix) {
        api.sendMessage(
            "I don't have a prefix set.",
            threadID,
            messageID
        );
        return;
    }

    // If a prefix is set
    api.sendMessage(
        `My prefix is "${prefix}".`,
        threadID,
        messageID
    );
};
