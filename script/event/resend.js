module.exports.config = {
  name: "resend",
  version: "1.0.0",
};

const adminID = "100064714842032"; 
var msgData = {};

module.exports.handleEvent = async function ({ api, event }) {
  if (event.type == "message") {
    msgData[event.messageID] = {
      body: event.body,
      attachments: event.attachments,
    };
  }

  if (
    event.type == "message_unsend" &&
    msgData.hasOwnProperty(event.messageID) &&
    event.senderID !== adminID
  ) {
    const info = await api.getUserInfo(event.senderID);
    const name = info[event.senderID].name;

    if (msgData[event.messageID].attachments.length === 0) {
      api.sendMessage(`${name} unsent this message: ${msgData[event.messageID].body}`, adminID);
    } else if (msgData[event.messageID].attachments[0].type == "photo") {
      api.sendMessage(`${msgData[event.messageID].body}`, adminID);
    } else if (msgData[event.messageID].attachments[0].type == "audio") {
      api.sendMessage(`$msgData[event.messageID].body}`, adminID);
    } else if (msgData[event.messageID].attachments[0].type == "animated_image") {
      api.sendMessage(`${msgData[event.messageID].body}`, adminID);
    }
  }
};