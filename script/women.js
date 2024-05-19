const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: 'women',
	version: '1.0.0',
	hasPermision: 0,
	credits: 'chilli',
	usePrefix: true,
	description: 'Send a video from Google Drive',
	commandCategory: 'media',
	usages: '',
	cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
	const videoUrl = "https://drive.google.com/uc?export=download&id=1--lgvkF6kOckzZe27gWeQ54ITjTRrqrk";
	const tmpFolderPath = path.join(__dirname, 'tmp');

	if (!fs.existsSync(tmpFolderPath)) {
		fs.mkdirSync(tmpFolderPath);
	}

	const filePath = path.join(tmpFolderPath, 'women_video.mp4');

	try {
		const response = await axios.get(videoUrl, { responseType: 'arraybuffer' });
		fs.writeFileSync(filePath, Buffer.from(response.data, 'binary'));

		const message = {
			body: "WOMEN KAPE!",
			attachment: fs.createReadStream(filePath)
		};

		await api.sendMessage(message, event.threadID, event.messageID);
		fs.unlinkSync(filePath); // Delete the video after sending
	} catch (error) {
		console.error('Error in women command:', error);
		api.sendMessage('An error occurred while processing the command.', event.threadID, event.messageID);
	}
};
