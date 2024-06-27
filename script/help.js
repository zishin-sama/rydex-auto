module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['h'],
  description: "Beginner's guide",
  usage: "Help/[command]",
  credits: 'Develeoper',
  cooldown: 0,
};

module.exports.run = async function ({ api, event, enableCommands, args, Utils, prefix }) {
  const input = args.join(' ');
  try {
    const eventCommands = enableCommands[1].handleEvent;
    const commands = enableCommands[0].commands;
    const pages = Math.ceil(commands.length / 10);

    if (!input || input.toLowerCase() === 'all') {
      let start = 0;
      let end = 10;
      let helpMessage = `「 COMMAND LIST 」\n\n`;
      for (let i = start; i < Math.min(end, commands.length); i++) {
        helpMessage += `\t${i + 1}. 『 ${prefix}${commands[i]} 』\n`;
      }
      helpMessage += `\n「 EVENT LIST 」\n\n`;
      eventCommands.forEach((eventCommand, index) => {
        helpMessage += `\t${index + 1}. 『 ${prefix}${eventCommand} 』\n`;
      });
      helpMessage += `\nPage: 1/${pages}\nTo view information about specific command, type ${prefix}help [command]`;
      api.sendMessage(helpMessage, event.threadID, event.messageID);
    } else if (input) {
      const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.toLowerCase().includes(input))?.[1];
      if (command) {
        const { name, version, role, aliases = [], description, usage, credits, cooldown, hasPrefix } = command;
        const roleMessage = role !== undefined ? (role === 0 ? 'Permission: User' : (role === 1 ? 'Permission: Admin' : (role === 2 ? 'Permission: Thread Admin' : (role === 3 ? 'Permission: Super Admin' : '')))) : '';
        const aliasesMessage = aliases.length ? `Aliases: ${aliases.join(', ')}\n` : '';
        const descriptionMessage = description ? `Description: ${description}\n` : '';
        const usageMessage = usage ? `Usage: ${usage}\n` : '';
        const creditsMessage = credits ? `Credits: ${credits}\n` : '';
        const versionMessage = version ? `Version: ${version}\n` : '';
        const cooldownMessage = cooldown ? `Cooldown: ${cooldown} second(s)\n` : '';
        const message = `「 Command Info 」\n\nName: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
        api.sendMessage(message, event.threadID, event.messageID);
      } else {
        api.sendMessage('Command not found.', event.threadID, event.messageID);
      }
    }
  } catch (error) {
    console.log(error);
  }
};