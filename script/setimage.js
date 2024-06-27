const axios = require("axios");

module.exports.config = {
  name: "setimage",
  version: "1.0.0",
  hasPrefix: true,
  credits: "Aze Kagenou",
  description: "change thread image",
  usage: "reply to image",
  aliases: ["si"],
  cooldown: 10,
  role: 0,
};

module.exports.run = async function({ api, event, args}) {
  try {
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0 || event.messageReply.attachments[0].type !== "photo") {
      api.sendMessage("Please reply to a photo to change the group image.", event.threadID);
      return;
    }
    
    const photoUrl = event.messageReply.attachments[0].url;

    const response = await axios.get(photoUrl, { responseType: 'stream' });
    
    await api.changeGroupImage(response.data, event.threadID);

    api.sendMessage("Group image changed successfully!", event.threadID);
  } catch (err) {
    api.sendMessage("Failed to change group image.", event.threadID);
  }
};
