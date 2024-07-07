const cron = require('node-cron');
const moment = require('moment-timezone');

module.exports.config = { name: "autogreet", version: "1" };

module.exports.handleEvent = async function({ api, event }) {
    const { threadID } = event;
    const tid = threadID;

    const threadList = await api.getThreadList(100, null, ["INBOX"], (err, list) => {
        list.forEach(info => {
            if (info.isGroup && info.isSubscribed) {
                cron.schedule('* * * * * *', () => {
                    const now = moment().tz("Asia/Manila").format('HH:mm:ss');
                    const message = getGreetingMessage(now);
                    sendGreeting(api, message, info.threadID);
                });
            }
        });
    });
};

function sendGreeting(api, message, threadID) {
    api.sendMessage(message, threadID);
}

function getGreetingMessage(time) {
    if (time === '07:00:00') {
        return "Hey sleepyheads! Rise and shine, the world is calling... or maybe it's just your mom yelling at you to get up. Either way, good morning, have a great day!";
    } else if (time === '12:00:00') {
        return "It's time for lunch everyone!";
    } else if (time === '15:00:00') {
        return "Good afternoon everyone! how's your day?";
    } else if (time === '18:00:00') {
        return "Good evening everyone! have y'all eaten? ";
    } else if (time === '21:00:00') {
        return "Good night sainyo guys, ako na muna magbabantay sa mundo, wag na kayo magpuyat sa maling tao HAHAHAHA";
    } else if (time === '00:00:00') {
        return "it's midnight now, is anyone up there?";
    } else if (time === '05:00:00') {
        return "Good morning everyone, have great day humans!";
    } else {
        return "";
    }
};