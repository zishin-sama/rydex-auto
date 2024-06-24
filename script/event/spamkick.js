const fs = require('fs');
let messageCounts = {};
const spamThreshold = 10;
const spamTimeFrame = 5000; // 5 seconds

try {
    messageCounts = JSON.parse(fs.readFileSync('messageCounts.json'));
} catch (err) {
    console.log('No existing message counts found. Starting fresh.');
}

module.exports.config = {
    name: "spamkick",
    version: "1.0.0"
};

module.exports.handleEvent = async function({ api, event }) {
    const { threadID, messageID, senderID } = event;

    if (!(await api.getThreadInfo(threadID)).adminIDs.some(e => e.id == api.getCurrentUserID())) {
        return api.sendMessage("", threadID);
    }

    const currentTime = new Date().getTime();

    if (!messageCounts[threadID]) {
        messageCounts[threadID] = {};
    }

    if (!messageCounts[threadID][senderID]) {
        messageCounts[threadID][senderID] = { count: 1, timestamp: currentTime };
    } else {
        const timeDifference = currentTime - messageCounts[threadID][senderID].timestamp;
        
        if (timeDifference <= spamTimeFrame) {
            messageCounts[threadID][senderID].count++;
            if (messageCounts[threadID][senderID].count > spamThreshold) {
                api.removeUserFromGroup(senderID, threadID);
                api.sendMessage({
                    body: "Spamming detected. The user has been removed from the group.",
                    mentions: [{ tag: senderID, id: senderID }]
                }, threadID, messageID);
            }			
        } else {
            messageCounts[threadID][senderID] = { count: 1, timestamp: currentTime };
        }
    }

    fs.writeFileSync('messageCounts.json', JSON.stringify(messageCounts));
};
