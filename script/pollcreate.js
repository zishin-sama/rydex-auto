"use strict";

module.exports.config = {
  name: "poll",
  hasPrefix: true,
  description: "create poll",
  usage: "",
  aliases: [],
  cooldown: 120
};

module.exports.run = async function({ api, event, args }) {
  try {
    // Check if the input contains the separator "|"
    const separatorIndex = args.indexOf("|");
    if (separatorIndex === -1) {
      api.sendMessage("Usage: /poll <question> | <option1> <option2> [...]", event.threadID);
      return;
    }

    // Extract the question and options based on the separator
    const question = args.slice(0, separatorIndex).join(" ");
    const options = args.slice(separatorIndex + 1);

    if (options.length === 0) {
      api.sendMessage("Please provide at least one option.", event.threadID);
      return;
    }

    // Create the poll using the question and options
    await api.createPoll(question, options, event.threadID);
    api.sendMessage("Poll created successfully!", event.threadID);
  } catch (err) {
    api.sendMessage("Failed to create poll: " + err.message, event.threadID);
  }
};
