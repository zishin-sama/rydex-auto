const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: 'women',
	version: '1.0.0',
	hasPermision: 0,
	credits: 'chillimansi',
	usePrefix: false,
	description: 'Send a video from Google Drive',
	commandCategory: 'media',
	usages: '',
	cooldowns: 0
};

module.exports.run = async ({ api, event }) => {
	try {
		const videoUrl = "https://drive.google.com/uc?export=download&id=1--lgvkF6kOckzZe27gWeQ54ITjTRrqrk";
		const tmpFolderPath = path.join(__dirname, 'tmp');

		if (!fs.existsSync(tmpFolderPath)) {
			fs.mkdirSync(tmpFolderPath);
		}

		const filePath = path.join(tmpFolderPath, 'women_video.mp4');

		// Download the video
		const videoResponse = await axios.get(videoUrl, { responseType: 'arraybuffer' });
		fs.writeFileSync(filePath, Buffer.from(videoResponse.data, 'binary'));

		// Send the video
		await api.sendMessage({
			attachment: fs.createReadStream(filePath)
		}, event.threadID, event.messageID);

		// Delete the video after sending the message
		fs.unlinkSync(filePath);

	} catch (error) {
		console.error('Error in women command:', error);
		return api.sendMessage('An error occurred while processing the command.', event.threadID);
	}
};
