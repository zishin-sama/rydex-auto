module.exports.config = {
		name: "work",
		version: "1.0.1",
		role: 0,
		credits: "Mirai Team",
		description: "If you work, you can eat!",
		cooldowns: 5,
		hasPrefix: false,
		aliases: ["wo"]
};

module.exports.run = async ({ event, api, Currencies }) => {
		const { threadID, messageID, senderID } = event;

		const cooldown = 300000; // 5 minutes in milliseconds
		let data = (await Currencies.getData(senderID)).data || {};

		if (typeof data !== "undefined" && cooldown - (Date.now() - (data.workTime || 0)) > 0) {
				const timeLeft = cooldown - (Date.now() - (data.workTime || 0));
				const minutes = Math.floor(timeLeft / 60000);
				const seconds = Math.floor((timeLeft % 60000) / 1000);
				return api.sendMessage(`You have worked today. Please come back after: ${minutes} minute(s) ${seconds} second(s).`, threadID, messageID);
		} else {
				const jobs = [
						"sell lottery tickets",
						"repair car",
						"programming",
						"hack Facebook",
						"chef",
						"mason",
						"fake taxi",
						"gangbang someone",
						"plumber ( ͡° ͜ʖ ͡°)",
						"streamer",
						"online seller",
						"housewife",
						'sell "flower"',
						"find jav/hentai code for SpermLord",
						"play Yasuo and carry your team"
				];

				const job = jobs[Math.floor(Math.random() * jobs.length)];
				const amount = Math.floor(Math.random() * 600);
				const rewardedMessage = `You did the job: ${job} and received: ${amount}$.`;

				await Currencies.increaseMoney(senderID, amount);
				data.workTime = Date.now();
				await Currencies.setData(senderID, { data });

				return api.sendMessage(rewardedMessage, threadID, messageID);
		}
};
