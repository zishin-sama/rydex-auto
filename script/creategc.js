module.exports.config = {
  name: "creategc",
  version: "1.0.0",
  hasPrefix: true,
  role: 0,
  credits: "Aze Kagenou",
  usage: "@mention multiple/@everyone",
  description: "create new gc",
  cooldown: 120,
  aliases: ["ngc","cgc"],
};

module.exports.run = async function({ api, event, args }) {
  try {
    const input = args.join(" ");

    if (!input.includes(" | ")) {
      api.sendMessage(`Invalid arguments. Please @mention at least or or @everyone and name of group separated by "|"`, event.threadID);
      return;
    }

    const [participantsPart, groupTitle] = input.split(" | ").map(part => part.trim());

    if (!groupTitle) {
      api.sendMessage("Please provide a valid group name.", event.threadID);
      return;
    }

    let mentions = [];
    let includeEveryone = false;

    if (participantsPart === "@everyone") {
      includeEveryone = true;
    } else {
      mentions = Object.keys(event.mentions);
    }

    if (includeEveryone) {
      const threadInfo = await api.getThreadInfo(event.threadID);
      mentions = threadInfo.participantIDs.filter(id => id !== api.getCurrentUserID());
    }

    if (mentions.length < 2) {
      api.sendMessage("Please mention at least two users or use @everyone to create a group.", event.threadID);
      return;
    }

    const threadID = await api.createNewGroup(mentions, groupTitle);
    
    api.sendMessage(`Group created successfully with name "${groupTitle}".`, threadID);
  } catch (err) {
    api.sendMessage("Failed to create group: " + err.message, event.threadID);
  }
};
