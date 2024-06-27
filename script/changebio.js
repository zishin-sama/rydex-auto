module.exports.config = {
  name: "changebio",
  version: "1.0.0",
  description: "Change your bot bio",
  role: 1,
  credits: "aze kagenou",
  hasPrefix: true,
  usage: "changebio [text]",
  aliases: ["cb"],
  cooldown: 5,
};
module.exports.run = async function ({ api, event, args }) {
    const newBio = args.join(" ");
    if (newBio) {
      try {
        await api.changeBio(newBio, true);
        api.sendMessage("Set bot biography to: " + newBio, event.threadID, event.messageID);
      } catch (error) {
        api.sendMessage("Failed to change bio. Please try again later.", event.threadID, event.messageID);
    }
  } else {
      api.changeBio(newBio, true);
    }
};
