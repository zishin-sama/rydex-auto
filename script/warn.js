const fs = require("fs");

module.exports.config = {
  name: "warn",
  version: "1.0.0",
  role: 2, // Role level required (2 for admin)
  credits: "churchill",
  description: "Warn a user.",
  commandCategory: "Moderation",
  usages: "[user mention or ID] [reason]",
  cooldowns: 0,
  hasPrefix: true
};

module.exports.run = async function({ api, event, args }) {
  const { threadID, messageID, senderID } = event;

  // Check if user has the required role level (admin)
  if (!isAdmin(senderID)) {
    return api.sendMessage("You don't have permission to use this command.", threadID, messageID);
  }

  // Check if the command has correct usage
  if (args.length < 2) {
    return api.sendMessage(`Usage: ${this.config.name} ${this.config.usages}`, threadID, messageID);
  }

  // Extract user ID from mention or directly provided ID
  const userId = extractUserId(args[0]);

  // Check if the user ID is valid
  if (!userId) {
    return api.sendMessage("Invalid user ID.", threadID, messageID);
  }

  // Get the reason for the warning
  const reason = args.slice(1).join(" ");

  // Log the warning
  const logMessage = `User ${userId} has been warned for: ${reason}`;
  console.log(logMessage);
  fs.appendFileSync("warn_logs.txt", logMessage + "\n");

  // Send a warning message to the user
  api.sendMessage(`<@${userId}> You have been warned for: ${reason}`, threadID, messageID);

  // Check the number of warnings for the user
  const warnings = getWarnings(userId);

  // If the user has reached the maximum number of warnings, remove them from the group
  if (warnings >= 3) {
    // Remove the user from the group
    api.removeUserFromGroup(userId, threadID);
    return api.sendMessage(`User <@${userId}> has been removed from the group due to multiple warnings.`, threadID);
  }

  return api.sendMessage(`User <@${userId}> has been warned for: ${reason}. This is their ${warnings} warning(s).`, threadID);
};

// Function to check if the user is an admin
function isAdmin(userId) {
  // Your logic to check if the user is an admin
  // For example, you can use an array of admin IDs and check if the user ID is in that array
  const adminIds = [100087212564100]; // Replace this with an array of actual admin IDs if needed
  return adminIds.includes(userId);
}

// Function to extract user ID from mention or provided ID
function extractUserId(input) {
  // Extract user ID from a mention
  if (input.startsWith("@")) {
    const mention = input.slice(1);
    const mentionedUser = api.getCurrentUserID(mention);
    return mentionedUser.id;
  }

  // If it's not a mention, assume it's a user ID
  return input;
}

// Function to get the number of warnings for a user
function getWarnings(userId) {
  // Your logic to retrieve the number of warnings for the user
  // For example, you can use an object to store warnings for each user
  const warnings = {
    12345678: 2, // Replace 12345678 with the actual user ID
    23456789: 1, // Replace 23456789 with the actual user ID
    // Add more user IDs and their corresponding warning counts as needed
  };

  return warnings[userId] || 0;
}
``
