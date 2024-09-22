module.exports.config = {
    name: "pinterest",
    version: "1.0.0",
    role: 0,
    credits: "Rydex",
    description: "Image search",
    hasPrefix: true,
    aliases: [],
    usage: "[Text]",
    cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const keySearch = args.join(" ");

    try {
        const res = await axios.get(`https://deku-rest-api.gleeze.com/api/pinterest?q=${keySearch}`);
        const data = res.data.result;

        if (!data || data.length === 0) {
            return api.sendMessage("No images found for the keyword: " + keySearch, event.threadID);
        }

        let imgData = [];
        for (let i = 0; i < data.length; i++) {
            const path = __dirname + `/cache/${i + 1}.jpg`;
            const imageResponse = await axios.get(data[i], { responseType: 'arraybuffer' });
            fs.writeFileSync(path, Buffer.from(imageResponse.data, 'binary'));
            imgData.push(fs.createReadStream(path));
        }

        api.sendMessage({
            attachment: imgData,
            body: `${imgData.length} Search results for keyword: ${keySearch}`
        }, event.threadID, event.messageID);

        // Clean up the cached images
        for (let i = 1; i <= imgData.length; i++) {
            fs.unlinkSync(__dirname + `/cache/${i}.jpg`);
        }
    } catch (error) {
        console.error("Error:", error);
        api.sendMessage("An error occurred while searching for images. Please try again later.", event.threadID);
    }
};
