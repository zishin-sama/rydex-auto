const fs = require('fs');

let blacklist = [];
try {
    const data = fs.readFileSync('./data/user.json', 'utf8');
    blacklist = JSON.parse(data);
} catch (err) {
    console.error('Error reading user blacklist:', err);
}

module.exports.config = {
    name: 'user',
    version: 'beta',
    role: 1,
    description: 'ban/unban user',
    usage: 'user ban/unban [uid]',
    aliases: [],
    hasPrefix: true,
    credits: 'aze',
    cooldown: 0
};

module.exports.run = async function ({ api, args, event }) {
    const cmd = args[0];
    
    if (!cmd || (cmd !== 'ban' && cmd !== 'unban' && cmd !== 'list')) {
        return api.sendMessage('Invalid command. Usage: user ban/unban [uid]', event.threadID);
    }
    
    if (cmd === 'ban') {
        const uid = args[1];
        if (!uid) return api.sendMessage('Please provide a user ID to ban.', event.threadID);
        
        if (blacklist.find(entry => entry.userid === uid)) {
            return api.sendMessage('User is already banned.', event.threadID);
        }

        blacklist.push({ userid: uid });
        const name = (await api.getUserInfo(uid))[uid].name;
        
        fs.writeFileSync('./data/user.json', JSON.stringify(blacklist, null, 2));
        
        api.sendMessage(`${name} has been banned.`, event.threadID);
    } else if (cmd === 'unban') {
        const uid = args[1];
        if (!uid) return api.sendMessage('Please provide a user ID to unban.', event.threadID);

        const userIndex = blacklist.findIndex(entry => entry.userid === uid);
        if (userIndex === -1) {
            return api.sendMessage('User is not in the blacklist.', event.threadID);
        }
        
        blacklist.splice(userIndex, 1);
        const name = (await api.getUserInfo(uid))[uid].name;

        fs.writeFileSync('./data/user.json', JSON.stringify(blacklist, null, 2));
        
        api.sendMessage(`${name} is now unbanned.`, event.threadID);
    } else if (cmd === 'list') {
        let bannedUsersList = 'List of banned users:\n';

        blacklist.forEach((entry, index) => {
            bannedUsersList += `${index + 1}. ${entry.name}\n`;
        });

        api.sendMessage(bannedUsersList, event.threadID);
        api.sendMessage('Reply with "unban [number]" to unban a user.', event.threadID);
    }
};