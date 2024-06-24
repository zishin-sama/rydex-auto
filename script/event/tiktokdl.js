const fs = require('fs');
const axios = require('axios');
const path = require('path');

module.exports.config = {
	name: "autotikdl",
	version: "1.0.0"
};
module.exports.handleEvent = async function({api, event}){
	try {
const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
						 const link = event.body;
																if (regEx_tiktok.test(link)) {
																	api.setMessageReaction("🚀", event.messageID, () => { }, true);
																	axios.post(`https://www.tikwm.com/api/`, {
																		url: link
																	}).then(async response => { // Added async keyword
																		const data = response.data.data;
																		const videoStream = await axios({
																			method: 'get',
																			url: data.play,
																			responseType: 'stream'
																		}).then(res => res.data);
																		const fileName = `TikTok-${Date.now()}.mp4`;
																		const filePath = `./${fileName}`;
																		const videoFile = fs.createWriteStream(filePath);

																		videoStream.pipe(videoFile);

																		videoFile.on('finish', () => {
																			videoFile.close(() => {
																				console.log('Downloaded video file.');

api.sendMessage({
body: `Auto Down Tiktok\n\nContent: ${data.title}\n\nLikes: ${data.digg_count}\n\nComments: ${data.comment_count}`,
attachment: fs.createReadStream(filePath)
}, event.threadID, () => {
fs.unlinkSync(filePath)});
            });
         })
     });
   } 
} catch (error) {
	}
};