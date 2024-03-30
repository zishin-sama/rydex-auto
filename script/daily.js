const config = {
	name: "daily",
	version: "1.0.2",
	role: 0,
	credits: "Mirai Team",
	description: "Get 100000 coins every day!",
	usage: "[daily]",
	cooldowns: 5,
	hasPrefix: false
};

const languages = {
	"en": {
			"cooldown": "You received today's rewards, please come back after: %1 hours %2 minutes %3 seconds.",
			"rewarded": "You received %1$, to continue to receive, please try again after 12 hours"
	}
};

const run = async ({ event, api, Currencies }) => {
	const { name, version, cooldowns, rewardCoin, cooldownTime } = config;
	const { senderID, threadID, messageID } = event;

	let data = (await Currencies.getData(senderID)).data || {};
	if (typeof data !== "undefined" && cooldownTime - (Date.now() - (data.dailyCoolDown || 0)) > 0) {
			var time = cooldownTime - (Date.now() - data.dailyCoolDown),
					seconds = Math.floor( (time/1000) % 60 ),
					minutes = Math.floor( (time/1000/60) % 60 ),
					hours = Math.floor( (time/(1000*60*60)) % 24 );

			const cooldownMessage = languages["en"]["cooldown"].replace("%1", hours)
					.replace("%2", minutes)
					.replace("%3", (seconds < 10 ? "0" : "") + seconds);

			return api.sendMessage(cooldownMessage, threadID, messageID);
	} else {
			const rewardedMessage = languages["en"]["rewarded"].replace("%1", rewardCoin);

			return api.sendMessage(rewardedMessage, threadID, async () => {
					await Currencies.increaseMoney(senderID, rewardCoin);
					data.dailyCoolDown = Date.now();
					await Currencies.setData(senderID, { data });
					return;
			}, messageID);
	}
};

module.exports = { config, languages, run };
