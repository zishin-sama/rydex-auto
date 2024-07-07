module.exports.config = {
  name: "getlink",
  version: "1.0.0",
  role: 0,
  description: "Get link of an attachment",
  usage: "reply to an image",
  aliases: [],
  credits: "Aze",
  cooldown: 0,
  hasPrefix: true
};

module.exports.run = async function ({ api, event }) {
  if (event.type === "message_reply" && event.attachments.length > 0) {
    event.attachments.forEach((attachment) => {
      if (attachment.type === "photo" || attachment.type === "file" || attachment.type === "video" || attachment.type === "animated_image") {
        const link = attachment.url;
        api.sendMessage(`${link}`, event.threadID);
      }
    });
  }
};