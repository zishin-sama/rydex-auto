const ytdl = require('ytdl-core');
										const fs = require('fs');
										const path = require('path');
										const simpleYT = require('simple-youtube-api');

module.exports.config = {
	name: "autoYtdl",
	version: "1.0.0"
};

const youtube = new simpleYT('AIzaSyDz2t3q8Mj_kSA7TM79Y7CYD9Dr2WESgGc');

module.exports.handleEvent = async function({api, event}) {
   try {								

const youtubeLinkPattern = /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;

										const videoUrl = event.body;

										if (youtubeLinkPattern.test(videoUrl)) {
											youtube.getVideo(videoUrl)
												.then(video => {
													const stream = ytdl(videoUrl, { quality: 'highest' });


													const filePath = path.join(__dirname, `./cache/${video.title}.mp4`);
													const file = fs.createWriteStream(filePath);


													stream.pipe(file);

													file.on('finish', () => {
														file.close(() => {
															api.sendMessage({ body: `Auto Down YouTube`, attachment: fs.createReadStream(filePath) }, event.threadID, () => fs.unlinkSync(filePath));
														});
													})
												});
												}
} catch(error) {																		}
											};