module.exports.config = { 
  name: "randomreact", 
  version: "1.0.0", 
  credits: "Aze Kagenou" 
};

const cooldowns = new Map();

module.exports.handleEvent = async function({ api, event }) {
  const name = (await api.getUserInfo(event.senderID))[event.senderID].name;
  const message = event.message.toLowerCase();

  if (message.includes("hi") || message.includes("hello")) {
    api.setMessageReaction("❤", event.messageID);
    api.sendMessage(`Hello, ${name} 🥰`, event.threadID);
  } else if (message.includes("women")) {
    api.setMessageReaction("☕", event.messageID);
  } else if (message.includes("iyak") || message.includes("lungkot") || message.includes("sad")) {
    api.setMessageReaction("😢", event.messageID);
  } else if (message.includes("haha")) {
    api.setMessageReaction("😆", event.messageID);
  } else if (message.includes("sana all")) {
    api.setMessageReaction("2⃣", event.messageID);
    api.sendMessage("(2)", event.messageID);
  } else if (message.includes("ok")) {
    api.setMessageReaction("👍", event.messageID);
  } else if (message.includes("ayoko na") || message.includes("pagod na ako")) {
    api.setMessageReaction("😢", event.messageID);
    api.sendMessage(`If you feel tired, you can rest. It's not the end. Remember that it's okay to feel tired.`, event.threadID);
  } else if (message.includes("tangina") || message.includes("tanga") || message.includes("bobo") || message.includes("gago")) {
    api.setMessageReaction("😠", event.messageID);
    api.sendMessage("No bad words allowed!", event.threadID);
  } else if (message.includes("good morning")) {
    api.setMessageReaction("❤", event.messageID);
    api.sendMessage(`Good morning ${name}, have a great day! 🥰`, event.threadID);
  } else {
    const emojis = [];
    for (let i = 0x1F600; i <= 0x1F64F; i++) {
      emojis.push(String.fromCodePoint(i));
    }

    if (cooldowns.has(event.senderID)) {
      const expirationTime = cooldowns.get(event.senderID);
      if (Date.now() < expirationTime) {
        return;
      }
    }

    const random = emojis[Math.floor(Math.random() * emojis.length)];
    api.setMessageReaction(random, event.messageID);
    
    // Set cooldown for the sender
    cooldowns.set(event.senderID, Date.now() + 60000);
  }
};