"use strict";

const axios = require("axios");

module.exports.config = {
  name: "changeimg",
  hasPrefix: true,
};

module.exports.run = async function({ api, event }) {
  try {
    // Ensure the command is a reply to a photo message
    if (!event.messageReply || !event.messageReply.attachments || event.messageReply.attachments.length === 0 || event.messageReply.attachments[0].type !== "photo") {
      api.sendMessage("Please reply to a photo message with the command 'changeimg' to change the group image.", event.threadID);
      return;
    }

    // Get the URL of the photo
    const photoUrl = event.messageReply.attachments[0].url;

    // Download the photo as a stream
    const response = await axios.get(photoUrl, { responseType: 'stream' });

    // Change the group image using the provided API
    await api.changeGroupImage(response.data, event.threadID);

    // Send a confirmation message
    api.sendMessage("Group image changed successfully!", event.threadID);
  } catch (err) {
    // Send an error message if changing the group image fails
    api.sendMessage("Failed to change group image: " + err.message, event.threadID);
  }
};
