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

async function sendMessage(message, threadId = event.threadID, messageId = event.messageID) {
    api.sendMessage(message, threadId, messageId);
}

module.exports.run = async function ({ api, event, args }) {
    var target = args[0];
    var message = args.slice(1).join(" ");

    if (!target) return sendMessage("Missing facebook url or uid");
    if (!message) return sendMessage("Missing message");

    try {
        if (target.startsWith("https://facebook.com")) {
            const res = await api.getUserID(target);
            var recipient = res;
        } else {
            var recipient = target;
        }

        const recipientName = (await api.getUserInfo(recipient))[recipient].name;

        api.sendMessage(`You've received a message: ${message}\n──────────────────── · : Don't bother me to ask who's the sender, you're just wasting your time ^^`, recipient, async (data) => {
            const confessionMessageID = data.messageID;

            if (!confessionMessageIDs[event.senderID]) {
                confessionMessageIDs[event.senderID] = [];
            }
            confessionMessageIDs[event.senderID].push(confessionMessageID);

            sendMessage("Confession has been sent successfully!");
        });

        // Check for message reply event
        if (event.type === "message_reply") {
            const replyEvent = event.messageReply;

            if (confessionMessageIDs[event.senderID].includes(replyEvent.messageID) && replyEvent.body) {
                api.sendMessage(`Recipient ${recipientName} replied: ${replyEvent.body}`, event.threadID);
            }
        }
    } catch (err) {
        sendMessage(`I'm sorry, but there was an issue sending your confession. Maybe it's a sign to have a direct conversation with that person and express your feelings instead ^^`);
    }
}
