const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "resend",
    version: "1.0.0",
};

const adminID = "100064714842032";
var msgData = {};

module.exports.handleEvent = async function ({ api, event }) {
    if (event.type === "message") {
        msgData[event.messageID] = {
            body: event.body,
            attachments: event.attachments,
            senderID: event.senderID,
            type: event.type,
        };
    }

    if (event.type === "message_unsend" && msgData.hasOwnProperty(event.messageID) && event.senderID !== adminID) {
        const info = await api.getUserInfo(msgData[event.messageID].senderID);
        const name = info[msgData[event.messageID].senderID].name;

        if (msgData[event.messageID].type === "message") {
            if (msgData[event.messageID].attachments.length === 0) {
                api.sendMessage(`${name} unsent this message: ${msgData[event.messageID].body}`, event.threadID, adminID);
            } else {
                for (const attachment of msgData[event.messageID].attachments) {
                    const attachmentPath = path.join(__dirname, `${event.messageID}-${attachment.id}`);

                    // Update the api.getFile check to handle different attachment types
                    if (attachment.type === "photo" || attachment.type === "animated_image" || attachment.type === "audio" || attachment.type === "video" || attachment.type === "file") {
                        // Send message based on attachment type
                        api.sendMessage({ body: `${name} unsent this ${attachment.type}`, attachment: attachment.url }, event.threadID, adminID);
                    } else if (attachment.type === "sticker" || attachment.type === "emoji") {
                        api.sendMessage({ stickerId: attachment.id, body: `${name} unsent this sticker` }, event.threadID, adminID);
                    }
                }
            }
        }
    }
};