module.exports.config = {
	name: 'help',
	version: '1.0.0',
	role: 0,
	hasPrefix: false,
	aliases: ['h'],
	description: "Beginner's guide",
	usage: "Help/[command]",
	credits: 'Developer',
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

		if (!input || !isNaN(input)) {
			let page = parseInt(input);
			if (isNaN(page) || page < 1) page = 1;
			const commandsPerPage = 10;
			const totalPages = Math.ceil(commands.length / commandsPerPage);

			if (page > totalPages) page = totalPages;

			const start = (page - 1) * commandsPerPage;
			const end = Math.min(start + commandsPerPage, commands.length);
			let helpMessage = `𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗟𝗜𝗦𝗧 (Page ${page}/${totalPages}):\n\n`;

			for (let i = start; i < end; i++) {
				helpMessage += `${i + 1}. ${prefix}${commands[i].config.name} - ${commands[i].config.description}\n`;
			}

			helpMessage += `\n𝗘𝗩𝗘𝗡𝗧 𝗟𝗜𝗦𝗧:\n\n`;
			for (let i = 0; i < eventCommands.length; i++) {
				helpMessage += `${i + 1}. ${prefix}${eventCommands[i].config.name} - ${eventCommands[i].config.description}\n`;
			}

			helpMessage += `\nTotal commands: ${commands.length}`;
			api.sendMessage(helpMessage, event.threadID, event.messageID);
		} else {
			const command = commands.find(cmd => cmd.config.name.toLowerCase() === input.toLowerCase() || cmd.config.aliases.includes(input.toLowerCase()));

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
				} = command.config;

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
		api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
	}
};
