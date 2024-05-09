const fs = require("fs");
module.exports.config = {
		name: "prefix",
		version: "1.0.1",
		hasPermssion: 0,
		credits: "jeka",
		description: "hihihihi",
		commandCategory: "no prefix",
		usePrefix: false,
		usages: "prefix",
		cooldowns: 5,
};

module.exports.handleEvent = function ({ api, event, client, __GLOBAL }) {
		var { threadID, messageID, senderID } = event;
		var senderName = "";
		api.getUserInfo(senderID, (err, result) => {
				if (err) {
						console.error(err);
						senderName = "";
				} else {
						senderName = result[senderID].name;
				}
				if (
						event.body.indexOf("prefix") == 0 ||
						event.body.indexOf("Prefix") == 0 ||
						event.body.indexOf("PREFIX") == 0 ||
						event.body.indexOf("prefi") == 0
				) {
						// Send text message with prefix information
						api.sendMessage(
								{
										body: `Yo, my prefix is [ 𓆩 ${global.config.PREFIX} 𓆪 ]\n
𝗦𝗢𝗠𝗘 𝗖𝗢𝗠𝗠𝗔𝗡𝗗𝗦 𝗧𝗛𝗔𝗧 𝗠𝗔𝗬 𝗛𝗘𝗟𝗣 𝗬𝗢𝗨:
➥ ${global.config.PREFIX}help [number of page] -> see commands
➥ ${global.config.PREFIX}sim [message] -> talk to bot
➥ ${global.config.PREFIX}callad [message] -> report any problem encountered
➥ ${global.config.PREFIX}help [command] -> information and usage of command\n\nHave fun using it enjoy!❤️\nBot Developer: ${global.config.OWNERLINK} `,
										attachment: fs.createReadStream(
												__dirname + `/noprefix/prefix.gif`
										),
								},
								threadID,
								messageID
						);

						// Send voice message with additional information
						const voiceFile = fs.readFileSync(
								__dirname + "/noprefix/prefix.gif"
						);
						api.sendMessage(
								{
										attachment: voiceFile,
										type: "audio",
										body: "Hey, listen to my prefix information!",
								},
								threadID,
								() => {}
						);

						api.setMessageReaction("🚀", event.messageID, (err) => {}, true);
				}
		});
};
module.exports.run = function ({ api, event, client, __GLOBAL }) {};
