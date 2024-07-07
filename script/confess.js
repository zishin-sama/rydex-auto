module.exports.config = {
  name: "confess",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  aliases: [],
  credits: "Deku",
  description: "Confess to someone",
  usage: "{p}{n} [fburl] or [uid] [message]",
  cooldown: 0
};

const confessionMessageIDs = {};

async function sendMessage(api, message, threadId, messageId) {
  api.sendMessage(message, threadId, messageId);
}

module.exports.run = async function ({ api, event, args }) {
  try {
    const target = args[0];
    const message = args.slice(1).join(" ");

    if (!target || !message) {
      return sendMessage(api, "Missing facebook url or uid or message");
    }

    let recipient;
    if (target.startsWith("https://facebook.com")) {
      const res = await api.getUserID(target);
      recipient = res;
    } else {
      recipient = target;
    }

    const recipientName = (await api.getUserInfo(recipient))[recipient].name;

    api.sendMessage(
      `You've received a message: ${message}\n──────────────────── · : Don't bother me to ask who's the sender, you're just wasting your time ^^`,
      recipient,
      async (data) => {
        const confessionMessageID = data.messageID;

        if (!confessionMessageIDs[recipient]) {
          confessionMessageIDs[recipient] = [];
        }
        confessionMessageIDs[recipient].push(confessionMessageID);

        sendMessage(api, "Confession has been sent successfully!");
      }
    );

    // Check for message reply event
    if (event.type === "message_reply") {
      const replyEvent = event.messageReply;

      if (
        confessionMessageIDs[replyEvent.senderID] &&
        confessionMessageIDs[replyEvent.senderID].includes(replyEvent.messageID) &&
        replyEvent.body
      ) {
        api.sendMessage(
          `Recipient ${recipientName} replied: ${replyEvent.body}`,
          event.threadID
        );
      }
    }
  } catch (err) {
    sendMessage(
      api,
      `I'm sorry, but there was an issue sending your confession. Maybe it's a sign to have a direct conversation with that person and express your feelings instead ^^`
    );
  }
};