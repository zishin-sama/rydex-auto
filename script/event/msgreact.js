
const fs = require('fs');
module.exports.config = {
    name: "random", 
    version: "1.1",
};

function getRandomDelay() {
    return Math.floor(Math.random() * 750) + 250; // delay between 250ms and 1000ms
}

module.exports.handleEvent = async function({ api, event }) {
    const { messageID, threadID } = event;
    const tid = threadID;
    const mid = messageID;
    const name = (await api.getUserInfo(event.senderID))[event.senderID].name;
    const { body } = event;
    const reactions = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "🥴", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤡", "🥳", "🥺", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🤲", "👐", "🙌", "👏", "🤝", "🤞", "🖖", "🤘", "🤙", "🤚", "🤛", "🤜", "🤟", "🤗", "🤩", "👍", "👎", "👊", "✊", "🤛", "🤜", "🤚", "👋", "🤟", "✌️", "🤞", "🤘", "💪", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🦷", "🦴", "👀", "👁️", "👅"];
    const cry = ["iyak", "sad", "lungkot", "lumbay", "pagod na ako", "im tired"];
    const morning = ["good morning", "goodmorning", "gomo", "ohayo"];
    const hi = ["hi", "hello", "konnichiwa"];
    const naol = ["sanaall", "naol", "sanaol"];
    const women = ['women', 'woman', 'eabab', 'babae'];

    if (cry.some(word => body.toLowerCase().includes(word))) {
        setTimeout(() => {
            api.setMessageReaction("😢", mid, () => {}, true);
        }, getRandomDelay());
    } else if (morning.some(word => body.toLowerCase().includes(word))) {
        setTimeout(() => {
            api.setMessageReaction("❤", mid, () => {}, true);
        }, getRandomDelay());
        setTimeout(async () => {
            await api.sendMessage(`Good morning, ${name}, eat your breakfast, have a nice day! 🥰`, tid, mid);
        }, getRandomDelay());
    } else if (hi.some(word => body.toLowerCase().includes(word))) {
        setTimeout(() => {
            api.setMessageReaction("🤩", mid, () => {}, true);
        }, getRandomDelay());
        setTimeout(async () => {
            await api.sendMessage(`Hello, ${name}`, tid, mid);
        }, getRandomDelay());
    } else if (naol.some(word => body.toLowerCase().includes(word))) {
        setTimeout(() => {
            api.setMessageReaction("2⃣", mid, () => {}, true);
        }, getRandomDelay());
        setTimeout(async () => {
            await api.sendMessage("(2)", tid, mid);
        }, getRandomDelay());
    } else if (women.some(word => body.toLowerCase().includes(word))) {
        setTimeout(() => {
            api.setMessageReaction("☕", mid, () => {}, true);
        }, getRandomDelay());
        setTimeout(async () => {
            var msg = {
                body: "Women ☕",
                attachment: fs.createReadStream(__dirname + `/../public/audio/women.mp3`)
            };
            await api.sendMessage(msg, tid, mid);
        }, getRandomDelay());
    } else {
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        setTimeout(() => {
            api.setMessageReaction(randomReaction, mid, () => {}, true);
        }, getRandomDelay());
    }
};