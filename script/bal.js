module.exports.config = {
		name: "bal",
		version: "1.0.2",
		role: 0,
	hasPrefix: false,
		credits: "Mirai Team",
		description: "Check the amount of yourself or the person tagged",
		aliases: ["balance", "money", "bank"],
		usages: "[Tag]",
		cooldowns: 5
};

module.exports.run = async function({ api, event, args, Currencies }) {
		const { threadID, messageID, senderID, mentions } = event;

		const languages = {
				"vi": {
						"sotienbanthan": "Số tiền bạn đang có: %1$",
						"sotiennguoikhac": "Số tiền của %1 hiện đang có là: %2$"
				},
				"en": {
						"sotienbanthan": "Your current balance: %1$",
						"sotiennguoikhac": "%1's current balance: %2$."
				}
		};

		if (!args[0]) {
				const money = (await Currencies.getData(senderID)).money;
				const language = languages["en"];
				return api.sendMessage(language["sotienbanthan"].replace("%1", money), threadID, messageID);
		} else if (Object.keys(event.mentions).length === 1) {
				const mention = Object.keys(mentions)[0];
				let money = (await Currencies.getData(mention)).money || 0;
				const language = languages["en"];
				return api.sendMessage({
						body: language["sotiennguoikhac"].replace("%1", mentions[mention].replace(/\@/g, "")).replace("%2", money),
						mentions: [{
								tag: mentions[mention].replace(/\@/g, ""),
								id: mention
						}]
				}, threadID, messageID);
		} else {
				// Handle other cases
		}
};
