const cron = require('node-cron');
const moment = require('moment-timezone');

module.exports.config = {
  name: "autogreet",
  version: "1"
};

module.exports.handleEvent = async function({ api, event }) {
  const { threadID } = event;
  const tid = threadID;
  const threadList = await api.getThreadList(100, null, ["INBOX"]);
  
  cron.schedule('0 7 * * *', () => {
    sendGreeting(api, "umaga na pala edi good morning humans! maligo na kayo puro kayo selpon", threadList);
  });
  
  cron.schedule('0 12 * * *', () => {
    sendGreeting(api, "magandang tanghali sa inyo, kumain na kayo?", threadList);
  });
  
  cron.schedule('0 15 * * *', () => {
    sendGreeting(api, "good afternoon everyone! meryenda na kayo", threadList);
  });
  
  cron.schedule('0 18 * * *', () => {
    sendGreeting(api, "good eves haha gabi na naman tangina, kumain na ba kayo?", threadList);
  });
  
  cron.schedule('0 21 * * *', () => {
    sendGreeting(api, "goodnight sainyo guys, ako na muna magbabantay sa mundo, wag na kayo magpuyat sa maling tao HAHAHAHA", threadList);
  });
  
  cron.schedule('0 0 * * *', () => {
    sendGreeting(api, "hating-gabi na, baka may gising pa dyan bebetime tayo", threadList);
  });
  
  cron.schedule('0 5 * * *', () => {
    let now = moment.tz("Asia/Manila").format('HH');
    if (now >= 5 && now < 7) {
      sendGreeting(api, "baka hindi kayo natulog ah, btw good morning everyone", threadList);
    }
  });
};

function sendGreeting(api, message, threadList) {
  threadList.forEach(thread => {
    api.sendMessage(message, thread.threadID);
  });
};