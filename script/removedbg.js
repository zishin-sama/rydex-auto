const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "removebg",
  version: "1.0.",
  role: 0,
  credits: "Mark Hitsuraan",
  description: "remove background to images",
  hasPrefix: true,
  aliases: ["rmbg"],
  usage: "reply to image",
  cooldown: 2,
};

module.exports.run = async ({ api, event, args }) => {
  let pathie = __dirname + `/cache/remove_bg.jpg`;
  const { threadID, messageID } = event;

  var mark = event.messageReply.attachments[0].url || args.join(" ");

  try {
    api.sendMessage("Removing background...", threadID, messageID);
    const response = await axios.get(`https://markdevs-last-api-a4sm.onrender.com/api/try/removebg?url=${encodeURIComponent(mark)}`);
    const processedImageURL = response.data.image_data;

    const img = (await axios.get(processedImageURL, { responseType: "arraybuffer"})).data;

    fs.writeFileSync(pathie, Buffer.from(img, 'binary'));

    api.sendMessage({
      body: "Processed Image",
      attachment: fs.createReadStream(pathie)
    }, threadID, () => fs.unlinkSync(pathie), messageID);
  } catch (error) {
    api.sendMessage(`Error processing image: ${error}`, threadID, messageID);
  };
};