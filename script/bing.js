const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "bing",
    version: "1.0.0",
    author: "Kaizenji | DEKU API",
    role: 0,
    cooldown: 20,
    credits: "cliff",//moddified by churchill
    usages: "[query]",
    hasPrefix: false,
};

module.exports.run = async function ({ api, event, args }) {
    try {
        const { messageID } = event;
        const query = args.join(' ');

        if (!query) {
            return api.sendMessage('Please provide a search query.', event.threadID, messageID);
        }

        const apiUrl = `https://deku-rest-api-3ijr.onrender.com/bing?prompt=${encodeURIComponent(query)}&mode=1`;
        api.sendMessage('Fetching images, please wait...', event.threadID);

        const response = await axios.get(apiUrl);

        if (response.data && response.data.images && response.data.images.length > 0) {
            const images = response.data.images;
            const imgData = [];

            for (let i = 0; i < images.length; i++) {
                const imageUrl = images[i].url;
                const fileName = `image_${i + 1}.jpg`;
                const filePath = path.join(__dirname, fileName);

                const imageResponse = await axios.get(imageUrl, {
                    responseType: 'arraybuffer'
                });

                fs.writeFileSync(filePath, Buffer.from(imageResponse.data, 'binary'));
                imgData.push(fs.createReadStream(filePath));
            }

            const message = {
                attachment: imgData,
                body: `Images for: ${query}`
            };

            api.sendMessage(message, event.threadID, (error, info) => {
                if (error) {
                    console.error('Error sending message:', error);
                } else {
                    for (let i = 0; i < images.length; i++) {
                        const fileName = `image_${i + 1}.jpg`;
                        const filePath = path.join(__dirname, fileName);
                        fs.unlinkSync(filePath);
                    }
                }
            });
        } else {
            api.sendMessage('No images found.', event.threadID);
        }
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage(`An error occurred: ${error.message}`, event.threadID);
    }
};
