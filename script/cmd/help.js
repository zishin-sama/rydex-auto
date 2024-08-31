module.exports.config = { 
    name: 'help', 
    version: '1.0.0', 
    role: 0, 
    hasPrefix: false, 
    aliases: ['cmds'], 
    description: "Beginner's guide", 
    usage: "Help/[command]", 
    credits: 'Developer', 
    cooldown: 0, 
}; 

module.exports.run = async function ({ api, event, enableCommands, args, Utils, prefix }) { 
    const input = args.join(' '); 

    try { 
        const eventCommands = enableCommands[1].handleEvent; 
        const commands = enableCommands[0].commands; 
        const pages = Math.ceil(commands.length / 10);

        if (!input) {
            let start = 0;
            let end = Math.min(10, commands.length);
            let helpMessage = `「 COMMAND LIST 」\n\n`;

            for (let i = start; i < end; i++) {
                helpMessage += `\t${i + 1}. 「 ${prefix}${commands[i]} 」\n`;
            }

            helpMessage += `\nPage: 1/${pages}. To view the next page, type '${prefix}help page number'.\nTo view information about a specific command, type '${prefix}help command'`;

            api.sendMessage(helpMessage, event.threadID, event.messageID);
        } 
        else if (input.toLowerCase() === 'all') {
            let helpMessage = `「 COMMAND LIST 」\n\n`;

            commands.forEach((command, index) => {
                helpMessage += `\t${index + 1}. 「 ${prefix}${command} 」\n`;
            });

            helpMessage += `\n「 EVENT LIST 」\n\n`;

            eventCommands.forEach((eventCommand, index) => {
                helpMessage += `\t${index + 1}. 「 ${prefix}${eventCommand} 」\n`;
            });
            helpMessage += `\nTotal commands: ${commands.length}\nTo view information about a specific command, type '${prefix}help command'`;
            api.sendMessage(helpMessage, event.threadID, event.messageID);
        } 
        else {
            const page = parseInt(input);
            if (Number.isInteger(page) && page > 0) {
                let start = (page - 1) * 10;
                let end = Math.min(page * 10, commands.length);
                let helpMessage = `「 COMMAND LIST 」\n\n`;

                for (let i = start; i < end; i++) {
                    helpMessage += `\t${i + 1}. 「 ${prefix}${commands[i]} 」\n`;
                }

                helpMessage += `\nPage: ${page}/${pages}\nTo view information about a specific command, type '${prefix}help command'`;

                api.sendMessage(helpMessage, event.threadID, event.messageID);
            } 
            else {
                const command = [...Utils.handleEvent, ...Utils.commands].find(([key]) => key.includes(input?.toLowerCase()))?.[1];

                if (command) {
                    const { name, version, role, aliases = [], description, usage, credits, cooldown, hasPrefix } = command;
                    const roleMessage = role !== undefined ? (role === 0 ? '➛ Permission: User' : (role === 1 ? '➛ Permission: Admin' : (role === 2 ? '➛ Permission: Thread Admin' : (role === 3 ? '➛ Permission: Super Admin' : '')))) : '';
                    const aliasesMessage = aliases.length ? `➛ Aliases: ${aliases.join(', ')}\n` : '';
                    const descriptionMessage = description ? `➛ Description: ${description}\n` : '';
                    const usageMessage = usage ? `➛ Usage: ${usage}\n` : '';
                    const creditsMessage = credits ? `➛ Credits: ${credits}\n` : '';
                    const versionMessage = version ? `➛ Version: ${version}\n` : '';
                    const cooldownMessage = cooldown ? `➛ Cooldown: ${cooldown} second(s)\n` : '';
                    const message = `「 Command 」\n\n➛ Name: ${name}\n${versionMessage}${roleMessage}\n${aliasesMessage}${descriptionMessage}${usageMessage}${creditsMessage}${cooldownMessage}`;

                    api.sendMessage(message, event.threadID, event.messageID);
                } 
                else {
                    api.sendMessage('Command not found.', event.threadID, event.messageID);
                }
            }
        }
    } 
    catch (error) { 
        console.log(error); 
    } 
};
