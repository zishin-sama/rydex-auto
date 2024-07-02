
const cooldowns = new Map();

module.exports.config = {
  name: "daily",
  version: "1",
  role: 0,
  hasPrefix: true,
  usage: "{n}",
  description: "get daily allowance 2 times a day only",
  aliases: [],
  credits: "",
  cooldown: 5
};

module.exports.run = async function ({ api, event }) {
  const userId = event.senderID;

  if (cooldowns.has(userId)) {
    const remainingTime = cooldowns.get(userId) - Date.now();
    if (remainingTime > 0) {
      const hours = Math.ceil(remainingTime / 3600000);
      api.sendMessage(`Sorry, you are on cooldown. Please try again in ${hours} hours.`, event.threadID);
      return;
    }
  }

  const allowance = Math.floor(Math.random() * (100000 - 10000 + 1)) + 10000;

  const userData = await Currencies.update(userId, allowance);

  const cooldownDuration = cooldowns.has(userId) ? 24 * 3600000 : 12 * 3600000;
  cooldowns.set(userId, Date.now() + cooldownDuration);

  api.sendMessage(`Here's your daily allowance: $${allowance}`, event.threadID);
};
