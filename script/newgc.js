"use strict";

module.exports.config = {
  name: "creategc",
  hasPrefix: true,
};

module.exports.run = async function({ api, event, args }) {
  try {
    // Convert args array to a single string
    const input = args.join(" ");

    // Check if the input contains the separator
    if (!input.includes(" | ")) {
      api.sendMessage("Usage: /creategc @mention1 @mention2 [@mention3 ...] | <group title> or /creategc @everyone | <group title>", event.threadID);
      return;
    }

    // Split the input into participants and group title
    const [participantsPart, groupTitle] = input.split(" | ").map(part => part.trim());

    if (!groupTitle) {
      api.sendMessage("Please provide a valid group title.", event.threadID);
      return;
    }

    let mentions = [];
    let includeEveryone = false;

    // Check if @everyone is mentioned
    if (participantsPart === "@everyone") {
      includeEveryone = true;
    } else {
      mentions = Object.keys(event.mentions);
    }

    // If @everyone is mentioned, retrieve all participants in the current thread
    if (includeEveryone) {
      const threadInfo = await api.getThreadInfo(event.threadID);
      mentions = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID());
    }

    if (mentions.length < 2) {
      api.sendMessage("Please mention at least two users or use @everyone to create a group.", event.threadID);
      return;
    }

    // Create the group using the provided API
    const threadID = await api.createNewGroup(mentions, groupTitle);

    // Send a confirmation message
    api.sendMessage(`Group created successfully with title "${groupTitle}".`, threadID);
  } catch (err) {
    // Send an error message if creating the group fails
    api.sendMessage("Failed to create group: " + err.message, event.threadID);
  }
};
