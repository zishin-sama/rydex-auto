const path = require('path');
const fs = require('fs');

const userDataFile = path.join(__dirname, 'cache', 'currencies.json');
let userData = JSON.parse(fs.readFileSync(userDataFile, { encoding: 'utf8' }));

const currencies = JSON.parse(fs.readFileSync(path.join(__dirname, '/cache/currencies.json'), { encoding: 'utf8' }));

const cooldownTime = 18000000; // 30 minutes in milliseconds

const languages = {
		"vi": {
				"cooldown": "Bạn đã làm công việc hôm nay, để tránh kiệt sức hãy quay lại sau: %1 phút %2 giây.",
				"rewarded": "Bạn đã làm công việc %1 và kiếm ra được %2$",
				"job1": "bán vé số",
				"job2": "sửa xe",
				"job3": "lập trình",
				"job4": "hack facebook",
				"job5": "đầu bếp",
				"job6": "thợ hồ",
				"job7": "fake taxi",
				"job8": "gangbang người nào đó",
				"job9": "thợ sửa ống nước may mắn  ( ͡° ͜ʖ ͡°)",
				"job10": "streamer",
				"job11": "bán hàng trực tuyến",
				"job12": "nội trợ",
				"job13": 'bán "hoa"',
				"job14": "tìm jav/hentai code cho SpermLord",
				"job15": "chơi Yasuo và gánh đội của bạn"
		},
		"en": {
				"cooldown": "You have worked today, to avoid exhaustion please come back after: %1 minute(s) %2 second(s).",
				"rewarded": "You did the job: %1 and received: %2$.",
				"job1": "sell lottery tickets",
				"job2": "repair car",
				"job3": "programming",
				"job4": "hack Facebook",
				"job5": "chef",
				"job6": "mason",
				"job7": "fake taxi",
				"job8": "gangbang someone",
				"job9": "plumber ( ͡° ͜ʖ ͡°)",
				"job10": "streamer",
				"job11": "online seller",
				"job12": "housewife",
				"job13": 'sell "flower"',
				"job14": "find jav/hentai code for SpermLord",
				"job15": "play Yasuo and carry your team"
		}
};

const getRandomJob = (language) => {
		const jobs = Object.values(languages[language]).filter(key => key.startsWith("job"));
		return jobs[Math.floor(Math.random() * jobs.length)];
};

const getText = (key, ...args) => {
		const language = userData.language || "en";
		const text = languages[language][key];
		if (!text) return "Text not found!";
		return text.replace(/%(\d+)/g, (match, index) => args[index - 1] || match);
};

module.exports.run = async ({ event, api }) => {
		const { threadID, messageID, senderID } = event;

		const data = userData[senderID] || {};
		if (data.workTime && cooldownTime - (Date.now() - data.workTime) > 0) {
				const time = cooldownTime - (Date.now() - data.workTime);
				const minutes = Math.floor(time / 60000);
				const seconds = ((time % 60000) / 1000).toFixed(0);

				return api.sendMessage(getText("cooldown", minutes, (seconds < 10 ? "0" + seconds : seconds)), threadID, messageID);
		} else {
				const job = getRandomJob(userData.language || "en");
				const amount = Math.floor(Math.random() * 600);
				return api.sendMessage(getText("rewarded", job, amount), threadID, async () => {
						userData[senderID] = { workTime: Date.now(), language: userData.language };
						fs.writeFileSync(userDataFile, JSON.stringify(userData, null, 2));
						return;
				}, messageID);
		}
};

module.exports.config = {
		name: "work",
		version: "1.0.1",
		role: 0,
		credits: "Mirai Team",
		description: "If you work, you can eat!",
		aliases: ["wo"],
		cooldowns: 5,
		hasPrefix: false,
};
