module.exports.config = {
    name: 'genpass',
    version: '1.0.0',
    hasPermision: 0,
    credits: 'chilli',
    usePrefix: true,
    description: 'Generate a random password',
    commandCategory: 'utilities',
    usages: '<length>',
    cooldowns: 5
};

function generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

module.exports.run = ({ api, event, args }) => {
    const length = parseInt(args[0], 10);

    if (isNaN(length) || length < 1) {
        return api.sendMessage("Please provide a valid password length (e.g., 12).", event.threadID, event.messageID);
    }

    const password = generatePassword(length);
    api.sendMessage(`Your generated password is: ${password}`, event.threadID, event.messageID);
};
