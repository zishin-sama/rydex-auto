module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['help'],
  description: "Beginner's guide",
  usage: "Help [page] or [command]",
  credits: 'Developer',
};

module.exports.run = async function ({
  api,
  event,
  enableCommands,
  args,
  Utils,
  prefix
}) {
  const input = args.join(' ');
  const senderName = (await api.getUserInfo(event.senderID))[event.senderID].name;

  try {
    const eventCommands = enableCommands[1].handleEvent;
    const commands = enableCommands[0].commands;

    if (!input) {
      const pages = 10; // Number of commands per page
      const page = 1; // Default to the first page
      const start = (page - 1) * pages;
      const end = start + pages;
      let helpMessage = `Hello, ${senderName}, here's my available commands:\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\n${i + 1}. ${prefix}${commands[i]}`;
      }

      helpMessage += `\n\nPage: ${page}/${Math.ceil(commands.length / pages)}\nTo view information about a specific command, type '${prefix}help [command name]'.`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else if (!isNaN(input)) {
      const page = parseInt(input);
      const pages = 10; // Number of commands per page
      const start = (page - 1) * pages;
      const end = start + pages;
      let helpMessage = `Hello, ${senderName}, here's my available commands:\n\n`;

      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\n${i + 1}. ${prefix}${commands[i]}`;
      }

      helpMessage += `\n\nPage: ${page}/${Math.ceil(commands.length / pages)}`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else {
      const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input.toLowerCase()))?.[1];

      if (command) {
        const {
          name,
          version,
          role,
          aliases = [],
          description,
          usage,
          credits,
          cooldown,
          hasPrefix
        } = command;

        const roleMessage = role !== undefined ? `Permission: ${['user', 'admin', 'thread Admin', 'super Admin'][role]}\n` : '';
        const aliasesMessage = aliases.length ? `Aliases: ${aliases.join(', ')}\n` : '';
        const descriptionMessage = description ? `Description: ${description}\n` : '';
        const usageMessage = usage ? `Usage: ${usage}\n` : '';
        const creditsMessage = credits ? `Credits: ${credits}\n` : '';
        const versionMessage = version ? `Version: ${version}\n` : '';
        const cooldownMessage = cooldown ? `Cooldown: ${cooldown} second(s)\n` : '';

        const message = `Command Info:\n\nName: ${name}\n${versionMessage}${roleMessage}${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage('Command not found.', event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
