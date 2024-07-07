const { Currencies } = require('./index');
const outcomes = ['🍒', '🍋', '🍊', '🍇', '🔔', '💰'];

function spinSlot() {
    return [getRandomOutcome(), getRandomOutcome(), getRandomOutcome()];
}

function getRandomOutcome() {
    return outcomes[Math.floor(Math.random() * outcomes.length)];
}

module.exports.config = {
    name: "slot",
    version: "1",
    role: 0,
    description: "Play the slot machine game",
    usage: "slot [bet]",
    hasPrefix: true,
    credits: "aze",
    cooldown: 3,
    aliases: []
};

module.exports.run = async function ({ api, args, event, Currencies }) {
    const bet = parseInt(args[0]);

    const userData = await Currencies.getData(event.senderID);

    if (!userData || userData.money < bet) {
        api.sendMessage("You have no balance.", event.threadID);
        return;
    }

    const result = spinSlot();
    const uniqueOutcomes = new Set(result);

    let message = "| " + result.join(" | ") + " | ";

    if (uniqueOutcomes.size === 1) {
        const winAmount = bet * 2;
        userData.money += winAmount;
        message += `Congratulations, you won $${winAmount}!`;
    } else {
        userData.money -= bet;
        message += `Sorry, you lost $${bet}. Better luck next time.`;
    }

    await Currencies.update(event.senderID, userData.money);

    api.sendMessage(message, event.threadID);
};