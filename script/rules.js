const fs = require("fs");

let rules = {};

module.exports.config = { 
  name: "rules", 
  version: "1.0", 
  description: "Display group rules in a specific thread", 
  role: 2,
  usage: "{pn}", 
  aliases: [], 
  hasPrefix: true, 
  credits: "Rydex", 
  cooldown: 3 
};

module.exports.run = async function ({api, args, event}) {
  const threadUid = event.threadID;

  if (!rules[threadUid]) {
    rules[threadUid] = [];
  }

  const command = args[0];

  if (command === "add") {
    const newRule = args.slice(1).join(" ");
    rules[threadUid].push(newRule);
    api.sendMessage(`New rule added: ${newRule}`, event.threadID);
  } else if (command === "edit") {
    const ruleNum = parseInt(args[1], 10);
    const updatedRule = args.slice(2).join(" ");
    
    if (rules[threadUid][ruleNum - 1]) {
      rules[threadUid][ruleNum - 1] = updatedRule;
      api.sendMessage(`Rule ${ruleNum} updated: ${updatedRule}`, event.threadID);
    } else {
      api.sendMessage(`Rule number ${ruleNum} not found.`, event.threadID);
    }
  } else if (command === "delete") {
    const ruleNum = parseInt(args[1], 10);

    if (rules[threadUid][ruleNum - 1]) {
      const deletedRule = rules[threadUid].splice(ruleNum - 1, 1);
      api.sendMessage(`Rule ${ruleNum} deleted: ${deletedRule}`, event.threadID);
    } else {
      api.sendMessage(`Rule number ${ruleNum} not found.`, event.threadID);
    }
  } else {
    // Display all rules
    if (rules[threadUid].length === 0) {
      api.sendMessage("No rules set for this thread.", event.threadID);
    } else {
      let ruleList = "Current Rules:\n";
      rules[threadUid].forEach((rule, index) => {
        ruleList += `${index + 1}. ${rule}\n`;
      });
      api.sendMessage(ruleList, event.threadID);
    }
  }

  fs.writeFile("rules.json", JSON.stringify(rules), (err) => {
    if (err) {
      console.error(err);
    }
  });
};
