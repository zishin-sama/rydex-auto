const cron = require('node-cron');
const moment = require('moment-timezone');

module.exports.config = { name: "autogreet", version: "1" };

// Track the last time a message was sent for each thread
const lastSentTimes = {};

module.exports.handleEvent = async function({ api, event }) {
    const { threadID } = event;

    try {
        const threadList = await api.getThreadList(100, null, ["INBOX"]);
        threadList.forEach(info => {
            if (info.isGroup && info.isSubscribed) {
                cron.schedule('*/1 * * * *', () => { // Runs every minute
                    const now = moment().tz("Asia/Manila").format('HH:mm:ss');
                    const message = getGreetingMessage(now);

                    if (message && shouldSendMessage(threadID, now)) {
                        sendGreeting(api, message, info.threadID);
                        updateLastSentTime(threadID, now);
                    }
                });
            }
        });
    } catch (error) {
        console.error('Error fetching thread list:', error);
    }
};

function sendGreeting(api, message, threadID) {
    api.sendMessage(message, threadID);
}

function getGreetingMessage(time) {
    switch (time) {
        case '07:00:00':
            return "Good morning. It's time to start a new day. Wishing you a productive and pleasant day ahead.";
        case '12:00:00':
            return "Good afternoon. I hope you are enjoying your lunch and having a productive day.";
        case '15:00:00':
            return "Good afternoon. I trust your day is going well and that you are making good progress.";
        case '18:00:00':
            return "Good evening. I hope you had a successful day. Enjoy your evening and relax.";
        case '21:00:00':
            return "Good night. I hope you had a fulfilling day. Wishing you a restful night and sweet dreams.";
        case '00:00:00':
            return "It's midnight. If you are still awake, I hope you are doing well and have a good rest.";
        case '05:00:00':
            return "Good morning. The day is just beginning. Wishing you a great start to your day.";
        default:
            return "";
    }
}

function shouldSendMessage(threadID, currentTime) {
    if (!lastSentTimes[threadID]) {
        lastSentTimes[threadID] = {};
    }
    const lastSentTime = lastSentTimes[threadID][currentTime];
    if (!lastSentTime || moment(currentTime, 'HH:mm:ss').diff(moment(lastSentTime, 'HH:mm:ss'), 'minutes') >= 1) {
        return true;
    }
    return false;
}

function updateLastSentTime(threadID, currentTime) {
    if (!lastSentTimes[threadID]) {
        lastSentTimes[threadID] = {};
    }
    lastSentTimes[threadID][currentTime] = currentTime;
}
