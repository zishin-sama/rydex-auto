const Currencies = require('./index');

module.exports.config = {
    name: "bal",
    version: "1.0.0",
    role: 0,
    hasPrefix: true,
    description: "check your balance",
    usage: "{n}",
    credits: "aze kagenou",
    cooldown: 5,
    aliases: []
};
const command = args[1];
module.exports.run = async function ({ api, args, event }) {
    const userId = event.senderID;

    try {
        const user = await Currencies.getData(userId);
        if (user) {
            api.sendMessage(`Your balance: $${user.money}`, event.threadID);
        } else {
            api.sendMessage("Unable to retrieve your balance.", event.threadID);
        }
    } catch (error) {
        console.error('Error checking balance:', error);
        api.sendMessage("An error occurred while checking your balance. Please try again later.", event.threadID);
    }

    const amount = parseInt(args[2]);

    if (command === "add") {
        try {
            if (userId && amount) {
                const updatedUser = await Currencies.update(userId, amount);
                api.sendMessage(`$${amount} has been added to the account with ID ${userId}`, event.threadID, event.messageID);
            } else if (amount) {
                const adminId = event.senderID;
                const updatedAdmin = await Currencies.update(adminId, amount);
                api.sendMessage(`Added $${amount} to your account`, event.threadID, event.messageID);
            } else {
                api.sendMessage("Invalid command usage. Please provide a valid user ID and amount.", event.threadID, event.messageID);
            }
        } catch (error) {
            console.error('Error setting money:', error);
            api.sendMessage("An error occurred while setting the money. Please try again later.", event.threadID, event.messageID);
        }
    }
};