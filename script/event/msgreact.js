module.exports.config = { 
   name: "msgreact", 
   version: "1.0.0",
   credits: "Aze Kagenou"
};
const cooldowns = new Map();

module.exports.handleEvent = async function({api, event}) {
	const name = (await api.getUserInfo(event.senderID))[event.senderID].name;
    const message = event.message.toLowerCase();
    
    if (message.includes("hi") || message.includes("hello")) {
    	api.setMessageReaction("❤", event.messageID, () => { }, true);
    api.sendMessage(`Hello, ${name} 🥰`, event.messageID);
    return;
    }
    if (message.includes("women")) {
    	api.setMessageReaction("☕", event.messageID, () => { }, true);
    return;
    }
    if (message.includes("iyak") || message.includes("lungkot") || message.includes("sad")) {
    	api.setMessageReaction("😢", event.messageID, () => { }, true);
    return;
    }
    if (message.includes("HAHA") || message.includes("haha") || message.includes("tawa")) {
    	api.setMessageReaction("😆", event.messageID, () => { }, true);
    return;
    }
    if (message.includes("sana all") || message.includes("sanaol") || message.includes("naol")) {
    	api.setMessageReaction("2⃣", event.messageID, () => { }, true);
    api.sendMessage("(2)", event.messageID);
    return;
    }
    if (message.includes("okay") || message.includes("ok")) {
    	api.setMessageReaction("👍", event.messageID, () => { }, true);
    return;
    }
    if (message.includes("ayoko na") || message.includes("pagod na ako")) {
    	api.setMessageReaction("😢", event.messageID, () => { }, true);
    api.sendMessage(`if you feel tired, you can rest. it\'s not the end baby. always remember that you\'re human and it is normal to be tired. all pain that you experiencing right now is okay and what you\'re feeling right now is temporary. kung ayaw mo makinig, bahala ka, tip ko sayo, tumalon ka sa pinakamataas na building galing rooftop`, event.messageID);
    return;
    }
    if (message.includes("tangina") || message.includes("tanga") || message.includes("bobo") || message.includes("gago")) {
    	api.setMessageReaction("😠", event.messageID, () => { }, true);
    api.sendMessage("bawal bad words!", event.messageID);
    return;
    }
    if (message.includes("good morning") || message.includes("magandang umaga") || message.includes("maayong buntag")) {
    	api.setMessageReaction("❤", event.messageID, () => { }, true);
    api.sendMessage(`good morning ${name}, have a great day! 🥰`, event.messageID);
    return;
    }
    /*
    if (message.includes("")) {
    	api.setMessageReaction("", event.threadID, () => { }, true);
    }
    api.sendMessage("", event.threadID);
    return;
    */
    
    const emojis = [];
    for (let i = 0x1F600; i <= 0x1F64F; i++) {
    	emojis.push(String.fromCodePoint(i));
    }
    
   if(cooldowns.has(event.senderID)) {
   	const expirationTime = cooldowns.get(event.senderID);
   if(Date.now() < expirationTime) {
   	return; 
   }
}

    const random = emojis[Math.floor(Math.random() * emojis.length)];
    api.setMessageReaction(random, event.messageID, () => { }, true);
};

   cooldowns.set(event.senderID); Date.now() + 60000; 
