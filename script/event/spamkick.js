const fs = require('fs');
let messageCounts = {};
const spamThreshold = 50;
const warningThresholds = [40, 30, 20, 10];
const warningCooldowns = [300000, 600000, 900000, 1200000];
let warningTimers = {};

try {
    messageCounts = JSON.parse(fs.readFileSync('messageCounts.json'));
} catch (err) {
    console.log('No existing message counts found. Starting fresh.');
}

module.exports.config = {
    name: "spamkick",
    version: "1.0.0"
};

module.exports.handleEvent = async function ({ api, event }) {
    const { threadID, senderID } = event;
    const adminID = "100064714842032";
    const name = (await api.getUserInfo(event.senderID))[event.senderID].name;

    if (!(await api.getThreadInfo(threadID)).adminIDs.some(e => e.id === api.getCurrentUserID())) {
        return api.sendMessage("", threadID);
    }

    if (!messageCounts[threadID]) {
        messageCounts[threadID] = {};
    }

    if (!messageCounts[threadID][senderID]) {
        messageCounts[threadID][senderID] = { count: 1, warnings: 0 };
    } else {
        messageCounts[threadID][senderID].count++;

        if (warningThresholds.includes(messageCounts[threadID][senderID].count)) {
            if (messageCounts[threadID][senderID].warnings < warningThresholds.length) {
                messageCounts[threadID][senderID].warnings++;
                const warningLevel = messageCounts[threadID][senderID].warnings;

                api.sendMessage(`${name} has reached warning level ${warningLevel}.`, event.threadID, adminID);

                const timerKey = `${threadID}_${senderID}_${warningLevel}`;
                if (warningTimers[timerKey]) {
                    clearTimeout(warningTimers[timerKey]);
                }
                warningTimers[timerKey] = setTimeout(() => {
                    messageCounts[threadID][senderID].warnings--;
                    delete warningTimers[timerKey];
                }, warningCooldowns[warningLevel - 1]);
            }

            if (messageCounts[threadID][senderID].warnings === warningThresholds.length) {
                api.removeUserFromGroup(senderID, threadID);
                api.sendMessage("The user has been removed from the group due to spamming.", event.threadID, adminID);
                delete messageCounts[threadID][senderID];
            }
        }
    }

    fs.writeFileSync('messageCounts.json', JSON.stringify(messageCounts));
};

setInterval(() => {
    for (const key in warningTimers) {
        clearTimeout(warningTimers[key]);
        const [threadID, senderID, warningLevel] = key.split('_');
        if (messageCounts[threadID] && messageCounts[threadID][senderID]) {
            messageCounts[threadID][senderID].warnings -= parseInt(warningLevel, 10);
        }
    }
}, 300000);

setInterval(() => {
	const adminID = "100064714842032";
    const now = new Date();
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        for (const key in warningTimers) {
            clearTimeout(warningTimers[key]);
        }
        messageCounts = {};
        fs.writeFileSync('messageCounts.json', JSON.stringify(messageCounts));
        warningTimers = {};
        console.log('Refreshed messageCounts data at 12:00 AM');
        api.sendMessage("Refreshed user's data spams and warnings.",adminID);
    }
}, 86400000);