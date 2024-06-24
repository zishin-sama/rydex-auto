module.exports.config = {
  name: "setnickname",
  version: "1.0.0",
  hasPrefix: true,
  description: "set nickname",
  aliases: ["snn"],
  cooldown: 5,
  usage: "setnickname",
  credits: "Aze Kagenou",
  role: 0
};

module.exports.run = async function({ api, event, args }) {
  try {
    if (args.length < 2) {
      api.sendMessage("setname @mention/uid [new nickname]", event.threadID);
      return;
    }

    // Remove the @ symbol from the mention
    let mention = Object.keys(event.mentions)[0];
    mention = mention.replace("@", "");

    let participantID = mention || args.shift();
    const newNickname = args.join(" ");

    if (!participantID || !newNickname) {
      api.sendMessage("Please provide a valid user mention or UID and a new nickname.", event.threadID);
      return;
    }

    if (!mention) {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const userIdsInThread = threadInfo.participantIDs;
      if (!userIdsInThread.includes(participantID)) {
        api.sendMessage("The provided UID is not in this thread.", event.threadID);
        return;
      }
    }

    await api.changeNickname(newNickname, event.threadID, participantID);

  } catch (err) {
    api.sendMessage("Failed to change nickname", event.threadID);
  }
};