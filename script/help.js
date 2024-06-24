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

module.exports.run = async function ({
	api,
	event,
	enableCommands,
	args,
	Utils,
	prefix
}) {
	const input = args.join(' ');
	try {
		const eventCommands = enableCommands[1].handleEvent;
		const commands = enableCommands[0].commands;
		if (!input) {
			const page = parseInt(input);
			const pages = 100;
			let start = (page - 1) * pages;
			let end = start + pages;
			let helpMessage = `𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧:\n\n`;
			for (let i = start; i < Math.min(end, commands.length); i++) {
				helpMessage += `\t${i + 1}. 『 ${prefix}${commands[i]} 』\n`;
			}
			helpMessage += '\n𝗘𝗩𝗘𝗡𝗧 𝗟𝗜𝗦𝗧:\n\n';
			eventCommands.forEach((eventCommand, index) => {
				helpMessage += `\t${index + 1}. 『 ${prefix}${eventCommand} 』\n`;
			});
			helpMessage += `\nTotal commands: ${commands.length}`;
			api.sendMessage(helpMessage, event.threadID, event.messageID);
		} else {
			const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];
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
				const roleMessage = role !== undefined ? (role === 0 ? 'Permission: User' : (role === 1 ? 'Permission: Admin' : (role === 2 ? 'Permission: Thread Admin' : (role === 3 ? 'Permission: Super Admin' : '')))) : '';
				const aliasesMessage = aliases.length ? `Aliases: ${aliases.join(', ')}\n` : '';
				const descriptionMessage = description ? `Description: ${description}\n` : '';
				const usageMessage = usage ? `Usage: ${usage}\n` : '';
				const creditsMessage = credits ? `Credits: ${credits}\n` : '';
				const versionMessage = version ? `Version: ${version}\n` : '';
				const cooldownMessage = cooldown ? `Cooldown: ${cooldown} second(s)\n` : '';
				const message = `Command Info\n\nName: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;
				api.sendMessage(message, event.threadID, event.messageID);
			} else {
				api.sendMessage('Command not found.', event.threadID, event.messageID);
			}
		}
	} catch (error) {
		console.log(error);
	}
};
