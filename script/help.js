module.exports.config = {
  name: 'help',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['show'],
  description: 'Display a list of commands or information about a specific command.',
  usage: 'help [command] or [page number]',
  credits: 'Developer',
};

module.exports.run = async function ({ api, event, enableCommands, args, Utils }) {
  const input = args.join(' ');
  const senderName = (await api.getUserInfo(event.senderID))[event.senderID].name;
  const { commands } = enableCommands[0];
  const { prefix } = enableCommands[1];
  const commandsPerPage = 10;
  const pages = Math.ceil(commands.length / commandsPerPage);
  const currentPage = parseInt(input, 10);

  if (!isNaN(currentPage) && currentPage > 0 && currentPage <= pages) {
    if (currentPage !== pages) {
      api.sendMessage(`Here's my available commands:\n\n`, event.threadID, (err, messageID) => {
        if (err) return console.log(err);
        let helpMessage = '';
        for (let i = (currentPage - 1) * commandsPerPage; i < currentPage * commandsPerPage; i++) {
          if (i < commands.length) {
            helpMessage += `\n${i + 1}. ${commands[i]}`;
          }
        }
        api.sendMessage(helpMessage + `\nPage: ${currentPage}/${pages}\nType 'help [command]' to view information about a specific command.`, event.threadID, messageID);
      });
    } else {
      api.sendMessage(`Here's my available commands:\n\n`, event.threadID, (err, messageID) => {
        if (err) return console.log(err);
        let helpMessage = '';
        for (let i = (currentPage - 1) * commandsPerPage; i < commands.length; i++) {
          helpMessage += `\n${i + 1}. ${commands[i]}`;
        }
        api.sendMessage(helpMessage + `\nPage: ${currentPage}/${pages}\nType 'help [command]' to view information about a specific command.`, event.threadID, messageID);
      });
    }
    return;
  }

  if (!input || input === 'all') {
    const pages = Math.ceil(commands.length / commandsPerPage);
    let helpMessage = 'Hi, ' + senderName + ', Here\'s my available commands:\n\n';
    for (let i = 0; i < commands.length; i++) {
      helpMessage += `\n${i + 1}. ${commands[i]}`;
      if ((i + 1) % commandsPerPage === 0) {
        helpMessage += `\nTotal commands: ${commands.length}\n\nType 'help [command]' to view information about a specific command`;
        api.sendMessage(helpMessage, event.threadID, event.messageID);
        helpMessage = 'Hi, ' + senderName + ', Here\'s my available commands:\n\n';
      }
    }
    api.sendMessage(helpMessage + `\nTotal commands: ${commands.length}\n\nType 'help [command]' to view information about a specific command.`, event.threadID, event.messageID);
  } else {
    const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input.toLowerCase()))?.[1];
    if (command) {
      const { name, version, role, aliases = [], description, usage, credits, cooldown, hasPrefix } = command;
      const roleMessage = role !== undefined ? `Permission: ${['user', 'admin', 'group admin', 'super admin'][role]}\n` : '';
      const aliasesMessage = aliases.length ? `Aliases: ${aliases.join(', ')}\n` : '';
      const descriptionMessage = description ? `Description: ${description}\n` : '';
      const usageMessage = usage ? `Usage: ${usage}\n` : '';
      const cooldownMessage = cooldown ? `Cooldown: ${cooldown} second(s)` : '';
      const message = `Command Info:\n\nName: ${name}\n${roleMessage}${aliasesMessage}${descriptionMessage}${usageMessage}${cooldownMessage}`;
      api.sendMessage(message, event.threadID, event.messageID);
    } else {
      api.sendMessage('Command not found.\nType "help" or "help all" to see the list of commands.', event.threadID, event.messageID);
    }
  }

  try {
    if (error.message.includes('invalid input syntax')) {
      api.sendMessage('Invalid page number!', event.threadID, event.messageID);
    } else {
      console.log(error);
      api.sendMessage('An error occurred. Please try again.', event.threadID, event.messageID);
    }
  } catch (error) {
  }
};
