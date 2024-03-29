const path = require('path');
const fs = require('fs');
const axios = require('axios');

module.exports.config = {
	name: "tools",
	version: "5.6.8",
	role: 0,
	hasPrefix: false,
	credits: "Eugene Aguilar",
	usage: "ai [ your question ]\n tiktokdl [ tiktok link ]\nCupcut [ cupcut template link ]\nTiksearch [ title ]\n shoti [ simple type ]",
	description: "Ai, tiktokdl, Cupcut, Tiksearch, shoti",
	aliases: ["tool"],
	cooldown: 5,
};

module.exports.run = async function ({ api, event, args }) {

	try {
	 if (args[0] === "list") {
		api.sendMessage(`List of available tools:\n- tiksearch\n- tiktokdl\n- cupcut\n- shoti\n- ai`, event.threadID, event.messageID);
	 } else if (args[0] === "ai") {
		const question = args.slice(1).join(" "); 
		if (!question) {
			api.sendMessage(`Missing question prompt!!`, event.threadID, event.messageID);
			return;
		}
		api.sendMessage(`Answering your question...`, event.threadID, event.messageID);
		const response = await axios.get(`https://eurix-api.replit.app/gpt4?ask=${question}`);
		const ans = response.data.answer;
		api.sendMessage(ans, event.threadID, event.messageID);
	 } else if (args[0] === "tiktokdl") {
		const link = args[1];
		if (!link) {
			api.sendMessage(`Please provide a TikTok video link.`, event.threadID, event.messageID);
			return;
		}
api.sendMessage(`downloading please wait...`, event.threadID, event.messageID);
		const response = await axios.get(`https://eurix-api.replit.app/api/tiktokdl/tools?link=${link}`);
		const videoUrl = response.data.url;
		const i = response.data.title;
		const videoPath = __dirname + "/cache/tiktokdl.mp4";
		const writer = fs.createWriteStream(videoPath);
		const videoStream = await axios.get(videoUrl, { responseType: "stream" });
		videoStream.data.pipe(writer);
		writer.on("finish", () => {
			api.sendMessage({ body: `Here's your Tiktok video:\nTitle: ${i}`, attachment: fs.createReadStream(videoPath) }, event.threadID, event.messageID);
		});
	 } else if (args[0] === "cupcut") {
		const url = args[1];
		if (!url) {
			api.sendMessage(`Please provide a URL from cupcut`, event.threadID, event.messageID);
			return;
		}
api.sendMessage(`downloading please wait...`, event.threadID, event.messageID);
		const response = await axios.get(`https://eurix-api.replit.app/api/cupcutdl/tools?url=${url}`);
		const videoUrl = response.data.url;
		const t = response.data.title;
		const videoPath = __dirname + "/cache/ccdl.mp4";
		const writer = fs.createWriteStream(videoPath);
		const videoStream = await axios.get(videoUrl, { responseType: "stream" });
		videoStream.data.pipe(writer);
		writer.on("finish", () => {
			api.sendMessage({ body: `Here's your cupcut video\nTitle: ${t}`, attachment: fs.createReadStream(videoPath) }, event.threadID, event.messageID);
		});
	 } else if (args[0] === "shoti") {
api.sendMessage(`shoti is sending please wait...`, event.threadID, event.messageID);
		const response = await axios.post(`https://eurix-api.replit.app/shoti`, { apikey: 'eugeneaguilar89' });
		const video = response.data.url;
		const title = response.data.username; 
		const nickname = response.data.nickname; 
		const filePath = __dirname + "/cache/shoti.mp4";
		const writer = fs.createWriteStream(filePath);
		const videoStream = await axios.get(video, { responseType: "stream" });
		videoStream.data.pipe(writer);
		writer.on('finish', () => {
			api.sendMessage({ body: `Here's your random shoti\nUsername: ${title}\nNickname: ${nickname}`, attachment: fs.createReadStream(filePath) }, event.threadID, event.messageID);
		});
	 } else if (args[0] === "tiksearch") {
		const query = args.slice(1).join(" ");
		if (!query) {
			api.sendMessage(`Please provide a query`, event.threadID, event.messageID);
			return;
		}
api.sendMessage(`searching please wait...`, event.threadID, event.messageID);
		const response = await axios.get(`https://eurix-api.replit.app/api/tiksearch/tools?search=${query}`);
		const videos = response.data.data.videos;
		const videoData = videos[0];
		const videoUrl = videoData.play;
		const title = videoData.title;
		const path = __dirname + "/cache/tiksearch.mp4";
		const writer = fs.createWriteStream(path);
		const videoStream = await axios.get(videoUrl, { responseType: "stream" });
		videoStream.data.pipe(writer);
		writer.on('finish', () => {
			api.sendMessage({ body: `Here's your tiktok\nTitle: ${title}`, attachment: fs.createReadStream(path) }, event.threadID, event.messageID);
		});
	 }
	} catch (error) {
	 api.sendMessage(`Error fetching tools!!`, event.threadID, event.messageID);
	 console.log(error);
	}
};