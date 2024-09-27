const axios = require("axios");
const fs = require("fs").promises;
const path = require("path");

module.exports.config = {
    name: "gemini",
    hasPrefix: true,
    description: "Get the URLs of the first two images when the user replies to an image.",
    role: 0, 
    credits: "Rydex",
    usage: "gemini",
    aliases: [],
    cooldown: 5,
};
module.exports.run = async function ({ api, event, args }) {
    const geminiApiUrl = "https://gemini.easy-api.online/v1/completion"; 

    try {
      const text = args.join(" ");
      if (!text) {
        return api.sendMessage("Please provide a question or query.", event.threadID, event.messageID);
      }
      
      await api.setMessageReaction("⏳", event.messageID, (err) => {}, true);

      let imageBase64Array = [];

      if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments.length > 0) {
        const attachments = event.messageReply.attachments;

        imageBase64Array = await Promise.all(attachments.map(async (attachment) => {
          if (attachment.type === "photo" || attachment.type === "animated_image" || attachment.type === "video") {
            const imageData = await downloadAndSaveImage(attachment.url, attachment.type);
            return imageData;
          }
        }));
      }

      const response = await axios.post(geminiApiUrl, {
        prompt: text,
        imageBase64Array,
      });

      const data = response.data.content;
      await api.setMessageReaction("✅", event.messageID, (err) => {}, true);

      api.sendMessage(data, event.threadID, event.messageID);
    } catch (error) {
    	a
      api.sendMessage("An error occurred while processing your request.", event.threadID);
    }
};

async function downloadAndSaveImage(imageUrl, imageType) {
  try {
    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    const imageBuffer = Buffer.from(response.data);
    
    const fileExtension = imageType === "video" ? "mp4" : "png";
    const fileName = `gemini_${Date.now()}.${fileExtension}`;

    const imagePath = path.join(__dirname, "cache", fileName);
    await fs.writeFile(imagePath, imageBuffer);

    const imageData = await fs.readFile(imagePath, { encoding: "base64" });
    return imageData;
  } catch (error) {
    console.error("Error downloading and saving image:", error);
    throw error;
  }
};
