const cron = require("node-cron");
const { sendGreeting } = require("./greeting");

const greetings = {
  morning: "Good morning everyone, gising na kayo, have a nice day ahead!",
  noon: "Tanghali na naman tangina, lunch na guys, hope you're having a great day!",
  afternoon: "Good afternoon everyone, enjoy the rest of your day!",
  evening: "Good evening everyone, have a pleasant evening! Have you eaten?",
  night: "Good night everyone, tulog na kayo, wag na kayo umasa at wag kayo magpuyat sa maling tao!",
  dawn: "Madaling araw na guys, baka may gising pa dyan o kakagising lang, good morning sa inyo!"
};

cron.schedule('0 6 * * *', async () => {
  await sendGreeting(greetings.morning);
}, { scheduled: true, timezone: "Asia/Manila" });

cron.schedule('0 12 * * *', async () => {
  await sendGreeting(greetings.noon);
}, { scheduled: true, timezone: "Asia/Manila" });

cron.schedule('0 15 * * *', async () => {
  await sendGreeting(greetings.afternoon);
}, { scheduled: true, timezone: "Asia/Manila" });

cron.schedule('0 18 * * *', async () => {
  await sendGreeting(greetings.evening);
}, { scheduled: true, timezone: "Asia/Manila" });

cron.schedule('0 21 * * *', async () => {
  await sendGreeting(greetings.night);
}, { scheduled: true, timezone: "Asia/Manila" });

cron.schedule('0 4 * * *', async () => {
  await sendGreeting(greetings.dawn);
}, { scheduled: true, timezone: "Asia/Manila" });

module.exports = {
  start: function () {
    cron.start();
  },
};