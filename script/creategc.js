module.exports.config = {
  name: "creategc",
  version: "1.0.0",
  hasPrefix: true,
  role: 0,
  credits: "Aze Kagenou",
  usage: "{n} @mention multiple/all [=> <name>]",
  description: "create new group chat",
  cooldown: 10,
  aliases: ["cgc"],
};

module.exports.run = async function ({ api, event, args }) {
  try {
    const input = args.join(" ");
    let [participantsPart, rest] = input.split("=>");
    let groupTitle = (rest && rest.trim()) || "";

    participantsPart = participantsPart.trim().replace(/<@(\d+)>/g, (_, id) => id);
    let mentions = participantsPart.split(" ").map(Number);
    let includeEveryone = false;

    if (participantsPart === "all" || "@everyone") {
      includeEveryone = true;
      mentions = [];
    }

    if (includeEveryone) {
      const threadInfo = await api.getThreadInfo(event.threadID);
      mentions = threadInfo.participantIDs;
    }

    if (mentions.length < 2 && !includeEveryone) {
      api.sendMessage("Please mention at least two users or 'all' to create a group. (Optional) Add '=> [name]' to name the group.", event.threadID);
      return;
    }

    const threadID = await api.createNewGroup(mentions, groupTitle);
    api.sendMessage(`Group created successfully.`, threadID);
  } catch (err) {
    api.sendMessage("Failed to create group: " + err.message, event.threadID);
  }
};