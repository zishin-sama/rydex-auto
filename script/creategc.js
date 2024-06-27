module.exports = {
  name: "creategc",
  version: "1.0.0",
  hasPrefix: true,
  role: 0,
  credits: "Aze Kagenou",
  usage: "@mention multiple/@everyone [=> <name>]",
  description: "create new gc",
  cooldown: 120,
  aliases: ["cgc"],
};

run = async function ({ api, event, args }) {
  try {
    const input = args.join(" ");
    let [participantsPart, groupTitle = "New Group"] = input.split(" => ");
    participantsPart = participantsPart
      .trim()
      .replace(/<@(\d+)>/g, (_, id) => id);
    let mentions = participantsPart.split(" ").map(Number);
    let includeEveryone = false;
    if (participantsPart === "@everyone") {
      includeEveryone = true;
      mentions = [];
    }
    if (includeEveryone) {
      const threadInfo = await api.getThreadInfo(event.threadID);
      mentions = threadInfo.participantIDs;
    }
    if (mentions.length < 2) {
      api.sendMessage("Please mention at least two users or use @everyone to create a group.", event.threadID);
      return;
    }
    const threadID = await api.createNewGroup(mentions, groupTitle);
    api.sendMessage(`Group created successfully.`, threadID);
  } catch (err) {
    api.sendMessage("Failed to create group: " + err.message, event.threadID);
  }
};