const axios = require("axios");

module.exports.config = {
  name: "gemini",
  role: 0,
  description: "Gemini Pro with image recognition",
  usage: "{prefix}gemini [prompt] or reply to image",
  aliases: ["gem"],
  cooldown: 3,
  hasPrefix:true,
};

async function convertImageToCaption(imageURL, api, event, inputText) {
  try {
    api.sendMessage("Gemini AI recognizing image, please wait...", event.threadID, event.messageID);

    const response = await axios.get(`https://haze-gemini-v-8ba147453283.herokuapp.com/gemini-vision?text=${encodeURIComponent(inputText)}&image_url=${encodeURIComponent(imageURL)}`);
    const caption = response.data.response;

    if (caption) {
      const formattedCaption = formatFont(caption);
      api.sendMessage(`${formattedCaption}`, event.threadID, event.messageID);
    } else {
      api.sendMessage("Failed to recognized the image.", event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("An error occured while recognizing image:", error);
    api.sendMessage("An error occured while recognizing image.", event.threadID, event.messageID);
  }
}

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.toLowerCase().startsWith("gemini"))) return;

  const args = event.body.split(/\s+/);
  args.shift();

  if (event.type === "message_reply") {
    if (event.messageReply.attachments[0]) {
      const attachment = event.messageReply.attachments[0];

       if (attachment.type === "photo") {
        const imageURL = attachment.url;
        convertImageToCaption(imageURL, api, event, args.join(' '));
        return;
      }
    }
  }

  const inputText = args.join(' ');

  if (!inputText) {
    return api.sendMessage("Hello I am Gemini Pro Vision trained by Google\n\nHow may I assist you today?", event.threadID, event.messageID);
  }
  
  api.sendMessage("Gemini AI is thinking, please wait...", event.threadID, event.messageID);

  try {
    const response = await axios.get(`https://haze-gemini-v-8ba147453283.herokuapp.com/gemini-vision?text=${encodeURIComponent(inputText)}`);
    if (response.status === 200 && response.data.response) {
    const response = (response.data.response);
      api.sendMessage(`${response}`, event.threadID, event.messageID);
    } else {
      console.error("Error generating response from Gemini API.");
    }
  } catch (error) {
    console.error("Error", error);
    api.sendMessage("An error occured while processing Gemini API", event.threadID, event.messageID);
  }
};

module.exports.run = async function ({ api, event }) {};
