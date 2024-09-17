module.exports.config = {
    name: "pinterest",
    version: "1.0.0",
    role: 0,
    credits: "Joshua Sy",
    description: "Image search to Pinterest",
    hasPrefix: true,
    aliases: ["pin"],
    usage: "pinterest [search] - [count of images]",
    cooldown: 0,
};

module.exports.run = async function({ api, event, args }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    const keySearch = args.join(" ");
    
    if (!keySearch.includes("-")) {
        return api.sendMessage('Please enter in the format, example: {prefix}pinterest Gojo Satoru - 10 (20 limit only)', event.threadID, event.messageID);
    }
    
    const keySearchs = keySearch.substr(0, keySearch.indexOf('-')).trim();
    const numberSearch = parseInt(keySearch.split("-").pop().trim()) || 6;
    
    // Ensure numberSearch is within bounds
    if (numberSearch > 20) return api.sendMessage('The maximum limit is 20 images', event.threadID, event.messageID);
    
    try {
        const res = await axios.get(`https://gpt4withcustommodel.onrender.com/api/pin?title=${encodeURIComponent(keySearchs)}&count=20`);
        const data = res.data.data;
        
        if (data.length < numberSearch) {
            return api.sendMessage(`Only ${data.length} results found for the keyword: ${keySearchs}`, event.threadID, event.messageID);
        }

        fs.ensureDirSync(__dirname + '/cache');
        let imgData = [];
        
        for (let i = 0; i < numberSearch; i++) {
            let path = __dirname + `/cache/image${i + 1}.jpg`;
            let imageBuffer = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
            fs.writeFileSync(path, Buffer.from(imageBuffer));
            imgData.push(fs.createReadStream(path));
        }
        
        api.sendMessage({
            attachment: imgData,
            body: `${numberSearch} search results for the keyword: ${keySearchs}`
        }, event.threadID, event.messageID);
        
        // Clean up the cache after sending the images
        for (let i = 0; i < numberSearch; i++) {
            fs.unlinkSync(__dirname + `/cache/image${i + 1}.jpg`);
        }
    } catch (error) {
        console.error(error);
        return api.sendMessage('An error occurred while fetching the images', event.threadID, event.messageID);
    }
};
