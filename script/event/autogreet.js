const cron = require("node-cron");

module.exports.config = { 
   name: "autogreet", 
   version: "1.0.0"
};

module.exports.handleEvent = async function ({ api, event }) {
    return { api, event };
};

const greetings = {
    morning: "Good morning everyone, gising na kayo, have a nice day ahead!",
    noon: "Tanghali na naman tangina, lunch na guys, hope you're having a great day!",
    afternoon: "Good afternoon everyone, enjoy the rest of your day!",
    evening: "Good evening everyone, have a pleasant evening! Have you eaten?",
    night: "Good night everyone, tulog na kayo, wag na kayo umasa at wag kayo magpuyat sa maling tao!",
    dawn: "Madaling araw na guys, baka may gising pa dyan o kakagising lang, good morning sa inyo!"
};

cron.schedule('0 6 * * *', function () {
    sendGreeting(greetings.morning);
}, { scheduled: true, timezone: "Asia/Manila" });

cron.schedule('0 12 * * *', function () {
    sendGreeting(greetings.noon);
}, { scheduled: true, timezone: "Asia/Manila" });

cron.schedule('0 15 * * *', function () {
    sendGreeting(greetings.afternoon);
}, { scheduled: true, timezone: "Asia/Manila" });

cron.schedule('0 18 * * *', function () {
    sendGreeting(greetings.evening);
}, { scheduled: true, timezone: "Asia/Manila" });

cron.schedule('0 21 * * *', function () {
    sendGreeting(greetings.night);
}, { scheduled: true, timezone: "Asia/Manila" });

cron.schedule('0 4 * * *', function () {
    sendGreeting(greetings.dawn);
}, { scheduled: true, timezone: "Asia/Manila" });

async function sendGreeting(message) {
    const { api } = await handleEvent({});
    api.getThreadList(100, null, ["INBOX"])
        .then(function (threadList) {
            threadList.forEach(function (thread) {
                if (thread.isGroup) {
                    const threadName = thread.name || "Unnamed Group";
                    const greeting = message.replace("{groupName}", threadName);
                    api.sendMessage(greeting, thread.threadID);
                }
            });
        })
        .catch(function (error) {
            console.error('Failed to get Thread List:', error);
        });
}