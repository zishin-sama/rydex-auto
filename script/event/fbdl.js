const getFBInfo = require("@xaviabot/fb-downloader");
															const axios = require('axios');
															const fs = require('fs');
															const fbvid = './video.mp4'; // Path to save the downloaded video
															
module.exports.config = {
	name: "autofbdl",
	version: "1.0.0"
};

module.exports.handleEvent = async function({api, event}){
	
const facebookLinkRegex = /https:\/\/www\.facebook\.com\/\S+/;

															const downloadAndSendFBContent = async (url) => {
																try {
																	const result = await getFBInfo(url);
																	let videoData = await axios.get(encodeURI(result.sd), { responseType: 'arraybuffer' });
																	fs.writeFileSync(fbvid, Buffer.from(videoData.data, "utf-8"));
																	return api.sendMessage({ body: "Auto Down Fb Video", attachment: fs.createReadStream(fbvid) }, event.threadID, () => fs.unlinkSync(fbvid));
																} catch (e) {
																	return console.log(e);
																}
					}
															};
															
															if (facebookLinkRegex.test(event.body)) {
																downloadAndSendFBContent(event.body);
																					    }
