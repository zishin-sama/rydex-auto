module.exports.config = {
	name: "goiadmin",
	version: "1.0.0",
	role: 0,
	credits: "John Arida",
	description: "Bot will rep ng tag admin or rep ng tagbot",
	usage: "",
	hasPrefix: false,
	cooldown: 5
};

module.exports.handleEvent = function({ api, event, admin }) {
	if (event.senderID !== admin && event.mentions) {
		var aid = [admin];
		for (const id of aid) {
			if (event.mentions[id]) {
				var msg = [
					"baby nalang itawag mo sakanya",
					"stop mentioning my creator, he's busy 😗",
					"my Creator is currently offline 😢",
					"busy pa ata yun kaya mag-antay ka",
					"sorry, busy pa, don't disturb him 🙄",
					"do you like my creator thats why your tagging him? why dont you add him https://www.facebook.com/100064714842032",
					"another tag in my creator, i will kick your fucking ass"
				];
				api.setMessageReaction("🙂", event.messageID, (err) => {}, true);
				return api.sendMessage({body: msg[Math.floor(Math.random()*msg.length)]}, event.threadID, event.messageID);
			}
		}
	}
};

module.exports.run = async function({ admin }) {
};
