module.exports.config = {
    name: "random", 
    version: "1.0.0",
    credits: "aze kagenou"
};

module.exports.handleEvent = async function({ api, event }) {
	const { messageID, threadID } = event;
	const tid = threadID;
	const mid = messageID;
	const name = (await api.getUserInfo(event.senderID))[event.senderID].name;
    const { body } = event;
    const reactions = ["😀", "😁", "😂", "🤣", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "☺️", "🙂", "🤗", "🤩", "🤔", "🤨", "😐", "😑", "😶", "🙄", "😏", "😣", "😥", "😮", "🤐", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "🤤", "😒", "😓", "😔", "😕", "🙃", "🤑", "😲", "☹️", "🙁", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😩", "🤯", "😬", "😰", "😱", "🥵", "🥶", "😳", "🤪", "😵", "🥴", "😡", "😠", "🤬", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "😇", "🤠", "🤡", "🥳", "🥺", "🧐", "🤓", "😈", "👿", "👹", "👺", "💀", "👻", "👽", "🤖", "💩", "😺", "😸", "😹", "😻", "😼", "😽", "🙀", "😿", "😾", "🤲", "👐", "🙌", "👏", "🤝", "🤞", "🖖", "🤘", "🤙", "🤚", "🤛", "🤜", "🤟", "🤗", "🤩", "👍", "👎", "👊", "✊", "🤛", "🤜", "🤚", "👋", "🤟", "✌️", "🤞", "🤘", "💪", "🦵", "🦶", "👂", "🦻", "👃", "🧠", "🦷", "🦴", "👀", "👁️", "👅", "👄", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "❤️‍🔥", "❤️‍🩹"]
    const cry = ["iyak","sad","lungkot","lumbay","pagod na ako","im tired"]
    const morning = ["good morning","goodmorning","gomo", "ohayo"]
    const hi = ["hi","hello","konnichiwa"]
    const naol = ["sanaall","naol","sanaol"]
    if (cry.some(word => body.includes.toLowerCase()(word))) {
    	api.setMessageReaction("😢", mid, () => {}, true);
    } else if (morning.some(word => body.includes.toLowerCase(word))) {
    	api.setMessageReaction("❤", mid, () => {}, true);
    api.sendMessage("Good morning, ${name}, eat your breakfast, have a nice day! 🥰", mid, tid);
    } else if (hi.some(word => body.includes.toLowerCase()(word))) {
    	api.setMessage("🤩", mid,() => {}, true);
    api.sendMessage("Hello, ${name}", mid, tid);
    } else if (naol.some(word => body.includes.toLowerCase()(word))) {
    	api.setMessageReaction("2⃣", mid, () => { }, true);
    api.sendMessage ("(2)",mid, tid);
    } else {
    const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
    api.setMessageReaction(randomReaction, mid, () => {}, true);
    }
};
