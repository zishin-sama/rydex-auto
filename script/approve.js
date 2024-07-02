module.exports.config = {
  name: "approve",
  version: "1.0",
  role: 1,
  description: "Approve message requests to be seen by the bot.",
  aliases: [],
  usage: "approve [threadID]",
  hasPrefix: true,
  credits: "Aze Kagenou",
  cooldown: 0
};

module.exports.run = async function ({ api, args, event }) {
  try {
    if (!args || args.length === 0) {
      return api.sendMessage("Please provide a thread ID to approve.", event.threadID);
    }

    const threadID = args[0];
    const accept = true;

    api.handleMessageRequest(threadID, accept, function (err) {
      if (err) {
        return api.sendMessage("Error handling message request: " + err.error, event.threadID);
      }

      api.sendMessage("Message request has been approved successfully.", event.threadID);
    });
  } catch (error) {
    console.error(error);
    api.sendMessage("An error occurred while processing the command.", event.threadID);
  }
};