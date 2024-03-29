const axios = require('axios');
const request = require('request');
const fs = require('fs');
const path = require('path');

module.exports.config = {
	name: 'checkweb',
	role: 0,
	credits: 'Jonell Magallanes',
	usage: 'checkweb [website]',
	cooldowns: 5,
	hasPrefix: false,
	description: 'check website'
};

module.exports.run = async function({ api, event, args }) {
		const apiKey = 'AIzaSyB4P6GQiDjrhaaYd7hdJ1XfMiU1qJCcPe0';
		const websiteToCheck = args[0];

		if (!websiteToCheck) {
			return api.sendMessage('Please provide a website to check.', event.threadID);
		}

		try {
			const response = await axios.post(
				`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${apiKey}`,
				{
					client: {
						clientId: '1057377756100-vui5l7hua9vi33ibh55tkuuajh3es9e7.apps.googleusercontent.com', // Replace with your client ID
						clientVersion: '1.0',
					},
					threatInfo: {
						threatTypes: ['MALWARE'],
						platformTypes: ['WINDOWS'],
						threatEntryTypes: ['URL'],
						threatEntries: [{ url: websiteToCheck }],
					},
				}
			);

			if (response.data.matches && response.data.matches.length > 0) {
				const threats = response.data.matches.map((match) => match.threat.url);
				const message = `Warning! This website is identified as unsafe. Threats found: ${threats.join(', ')}`;
				sendUnsafeImage(api, event.threadID, websiteToCheck, message);
			} else {
				sendSafeImage(api, event.threadID, websiteToCheck);
			}
		} catch (error) {
			console.error('Error checking website safety:', error);
			return api.sendMessage('Error checking website safety. Please try again later.', event.threadID);
		}
};

function sendSafeImage(api, threadID, websiteToCheck) {
	const safeImagePath = path.join(__dirname, 'cache', 'safe.jpg'); 
	copyImage('https://i.postimg.cc/BQXjJFbt/safe.png', safeImagePath, () => {
		api.sendMessage({ body: `This Website ${websiteToCheck} has been safe You can proceed this link without worries!`, attachment: fs.createReadStream(safeImagePath) }, threadID);
	});
}

function sendUnsafeImage(api, threadID, websiteToCheck, warningMessage) {
	const unsafeImagePath = path.join(__dirname, 'cache', 'unsafe.jpg'); 
	copyImage('https://i.postimg.cc/50dkPfCm/unsafe.png', unsafeImagePath, () => {
		api.sendMessage({ body: `This Website ${warningMessage} has been not safe This link "${websiteToCheck}" has contained miscellaneous website can steal your info Imformation, credits cards ect,if process this with caution`, attachment: fs.createReadStream(unsafeImagePath) }, threadID);
	});
}

function copyImage(sourceUrl, destinationPath, callback) {
	request(sourceUrl).pipe(fs.createWriteStream(destinationPath)).on('close', callback);
}
