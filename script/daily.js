const cooldowns = new Map();
const { Currencies } = require('./index');
module.exports.config = {
    name: "daily",
    version: "1",
    role: 0,
    hasPrefix: true,
    usage: "daily",
    description: "get daily allowance 2 times a day only",
    aliases: [],
    credits: "",
    cooldown: 5
};

module.exports.run = async function ({ api, event }) {
    const userId = event.senderID;

    if (!cooldowns.has(userId)) {
        cooldowns.set(userId, { uses: 0, lastUse: 0 });
    }

    const userCooldown = cooldowns.get(userId);
    const currentTime = Date.now();

    if (userCooldown.lastUse + userCooldown.uses * 12 * 3600000 > currentTime) {
        const remainingTime = userCooldown.lastUse + userCooldown.uses * 12 * 3600000 - currentTime;
        const hours = Math.ceil(remainingTime / 3600000);
        api.sendMessage(`Sorry, you are on cooldown. Please try again in ${hours} hours.`, event.threadID);
        return;
    }

    if (userCooldown.uses >= 2) {
        api.sendMessage("You have already used your daily allowance maximum times.", event.threadID);
        return;
    }

    const allowance = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;
    const userData = await Currencies.update(userId, allowance);

    userCooldown.uses++;
    userCooldown.lastUse = currentTime;
    
    api.sendMessage(`Here's your daily allowance: $${allowance}`, event.threadID);
};