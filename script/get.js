const axios = require("axios");

module.exports.config = {
  name: "get",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  description: "get your cookie without extension",
  usage:"{prefix}get <email> <password>",
  credits: "Mark Hitsuraan",
  aliases: [],
  cooldown: 3
};

module.exports.run = async function({ api, event, args }) {
  if (args.length !== 2) {
    return api.sendMessage(
      "Invalid Arguments!",
      event.threadID,
      event.messageID
    );
  }

  api.sendMessage(
    "Getting cookie...",
    event.threadID,
    event.messageID
  );

  const [email, password] = args.map(arg => arg.trim());

  try {
    const response = await axios.get(
      `https://deku-rest-api-ywad.onrender.com/getcookie?email=${email}&password=${password}`
    );
    const appstateData = response.data;
    
    const formattedAppstate = appstateData.map(item => ({
      key: item.key,
      value: item.value,
      domain: item.domain,
      path: item.path,
      hostOnly: item.hostOnly,
      creation: item.creation,
      lastAccessed: item.lastAccessed
    }));

    api.sendMessage(
      JSON.stringify(formattedAppstate, null, 4),
      event.threadID,
      event.messageID
    );
  } catch (error) {
    console.error("Error:", error);
    api.sendMessage(
      "An error occurred. Please change your password and try again.",
      event.threadID,
      event.messageID
    );
  }
};
