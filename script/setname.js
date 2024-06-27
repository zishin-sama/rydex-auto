module.exports.config = {
  name: "setname",
  version: "1.0.0",
  hasPrefix: true,
  description: "set nickname",
  aliases: ["snn"],
  cooldown: 5,
  usage: "setname [mention/uid] [new nickname]",
  credits: "Aze Kagenou",
  role: 0,
};

module.exports.run = async function ({ api, event, args }) {
  try {
    if (args.length < 1) {
      api.sendMessage("Please provide a mention, UID or 'all' to change nickname.", event.threadID);
      return;
    }

    let participantID = args.shift();
    let newNickname = args.join(" ");

    if (participantID === "all") {
      const threadInfo = await api.getThreadInfo(event.threadID);
      const userIdsInThread = threadInfo.participantIDs;
      for (const userId of userIdsInThread) {
        await api.changeNickname(newNickname, event.threadID, userId);
      }
      return;
    }

    if (!newNickname) {
      api.sendMessage("Please provide a nickname.", event.threadID);
      return;
    }

    if (event.mentions.length > 0) {
      participantID = Object.keys(event.mentions)[0];
      participantID = participantID.replace("@", "");
    }

    if (!participantID) {
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