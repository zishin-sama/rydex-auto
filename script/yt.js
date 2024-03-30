const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");
const ytdl = require("ytdl-core");
const { searchVideos } = require("simple-youtube-api");

module.exports.config = {
	name: "yt",
	version: "1.0.0",
	role: 0,
	credits: "Nayan",
	description: "",
	hasPrefix: false,
	usage: "Link",
	cooldowns: 5,
};

module.exports.handleEvent = async function ({ api: e, event: a }) {
	try {
		const response = await axios.get("https://raw.githubusercontent.com/MR-NAYAN-404/api1/main/video.json");
		const r = response.data.keyVideo.length;
		const o = response.data.keyVideo[Math.floor(Math.random() * r)];
		const { createReadStream, createWriteStream, unlinkSync, statSync } = fs;

		let content = (event.type === "message_reply") ? event.messageReply.body : args.join(" ");
		const u = parseInt(content);
		if (isNaN(u) || (u < 1 || u > 6)) return e.sendMessage("Choose from 1 -> 6, baby ❤️", a.threadID, a.messageID);

		e.unsendMessage(a.messageID);
		const g = {
			method: "GET",
			url: "https://ytstream-download-youtube-videos.p.rapidapi.com/dl",
			params: { id: `${o.API_KEY}` }
		};
		const p = (await axios.request(g)).data;
		const y = p.title;
		if ("fail" == p.status) return e.sendMessage("Không thể gửi file này.", a.threadID);
		const f = Object.keys(p.link)[1];
		const b = p.link[f][0];
		const path1 = __dirname + "/cache/1.mp4";
		const responseData = (await axios.get(`${b}`, { responseType: "arraybuffer" })).data;

		fs.writeFileSync(path1, Buffer.from(responseData, "utf-8"));
		if (fs.statSync(__dirname + "/cache/1.mp4").size > 26e6) {
			return e.sendMessage("The file could not be sent because it is larger than 25MB..", a.threadID, () => fs.unlinkSync(__dirname + "/cache/1.mp4"), a.messageID);
		} else {
			return e.sendMessage({
				body: `» ${y}`,
				attachment: fs.createReadStream(__dirname + "/cache/1.mp4")
			}, a.threadID, () => fs.unlinkSync(__dirname + "/cache/1.mp4"), a.messageID);
		}
	} catch {
		return e.sendMessage("Không thể gửi file này!", a.threadID, a.messageID);
	}
};

module.exports.run = async function ({ api: e, event: a, args: t }) {
	try {
		const info = await axios.get("https://raw.githubusercontent.com/MR-NAYAN-404/api1/main/video.json");
		const r = info.data.keyVideo.length;
		const o = info.data.keyVideo[Math.floor(Math.random() * r)];
		const { createReadStream, createWriteStream, unlinkSync, statSync } = fs;
		const u = ["AIzaSyB5A3Lum6u5p2Ki2btkGdzvEqtZ8KNLeXo", "AIzaSyAyjwkjc0w61LpOErHY_vFo6Di5LEyfLK0", "AIzaSyBY5jfFyaTNtiTSBNCvmyJKpMIGlpCSB4w", "AIzaSyCYCg9qpFmJJsEcr61ZLV5KsmgT1RE5aI4"];
		const g = u[Math.floor(Math.random() * u.length)];
		const p = new searchVideos(g);

		if (t.length === 0 || !t) return e.sendMessage("» Search cannot be left blank!", a.threadID, a.messageID);
		const y = t.join(" ");

		if (t.join(" ").startsWith("https://")) {
			const b = (await axios.get("https://ytstream-download-youtube-videos.p.rapidapi.com/dl", {
				params: { id: t.join(" ").split(/^.*(youtu.be\/|v\/|embed\/|watch\?|youtube.com\/user\/[^#]*#([^\/]*?\/)*)\??v?=?([^#\&\?]*).*/)[3] },
				headers: { "x-rapidapi-host": "ytstream-download-youtube-videos.p.rapidapi.com", "x-rapidapi-key": `${o.API_KEY}` }
			})).data;

			const v = b.title;
			if ("fail" == b.status) return e.sendMessage("Unable to send this file.", a.threadID);

			const I = Object.keys(b.link)[1];
			const link = b.link[I][0];
			const path1 = __dirname + "/cache/1.mp4";
			const responseData = (await axios.get(`${link}`, { responseType: "arraybuffer" })).data;

			fs.writeFileSync(path1, Buffer.from(responseData, "utf-8"));
			if (fs.statSync(__dirname + "/cache/1.mp4").size > 26e6) {
				return e.sendMessage("The file could not be sent because it is larger than 25MB..", a.threadID, () => fs.unlinkSync(__dirname + "/cache/1.mp4"), a.messageID);
			} else {
				return e.sendMessage({
					body: `» ${v}`,
					attachment: fs.createReadStream(__dirname + "/cache/1.mp4")
				}, a.threadID, () => fs.unlinkSync(__dirname + "/cache/1.mp4"), a.messageID);
			}
		}

		const w = [];
		let _ = "";
		let D = 0;
		let S = 0;
		const M = [];
		const $ = await p.searchVideos(y, 6);

		for (const e of $) {
			if (void 0 === e.id) return;
			w.push(e.id);
			const a = __dirname + `/cache/${S+=1}.png`;
			const s = `https://img.youtube.com/vi/${e.id}/hqdefault.jpg`;
			const responseData = (await axios.get(`${s}`, { responseType: "arraybuffer" })).data;
			const r = (await axios.get(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${e.id}&key=${g}`)).data.items[0].contentDetails.duration.slice(2).replace("S", "").replace("M", ":");
			if (fs.writeFileSync(a, Buffer.from(responseData, "utf-8")), M.push(fs.createReadStream(__dirname + `/cache/${S}.png`)), 1 == (D = D += 1)) var x = "⓵";
			if (2 == D) x = "⓶";
			if (3 == D) x = "⓷";
			if (4 == D) x = "⓸";
			if (5 == D) x = "⓹";
			if (6 == D) x = "⓺";
			_ += `${x} 《${r}》 ${e.title}\n\n`;
		}
		const j = `»🔎 Have ${w.length} the list matches your search keyword:\n\n${_}» Please reply (reply by number) choose one of the above searches`;

		return e.sendMessage({
			attachment: M,
			body: j
		}, a.threadID, (e, t) => this.handleEvent({ api: e, event: t }), a.messageID);
	} catch (t) {
		return e.sendMessage("The request could not be processed due to a module error: " + t.message, a.threadID, a.messageID);
	}
};
