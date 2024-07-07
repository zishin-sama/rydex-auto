const axios = require('axios');

module.exports.config = {
    name: 'autoreact',
    version: 'beta',
    role: 0,
    hasPrefix: true,
    aliases: [],
    description: 'Get reactions for a post',
    cooldown: 0,
    credits: 'aze'
};

module.exports.run = async function ({ api, event, args }) {
    const input = args.join(' ').split(/[\s=]+/);
    const cookie = input[0];
    const link = input[1];
    const type = input[2];

    if (!link || !type) {
        api.sendMessage(`Invalid arguments! Usage: autoreact [cookie] = [link] [type]`, event.threadID);
        return;
    }

    api.sendMessage(`Reacting to ${link}`, event.threadID);

    try {
        const response = await axios.post(
            "https://flikers.net/android/android_get_react.php",
            {
                post_id: link,
                react_type: type,
                version: "v1.7"
            },
            {
                headers: {
                    'User-Agent': "Dalvik/2.1.0 (Linux; U; Android 12; V2134 Build/SP1A.210812.003)",
                    'Connection': "Keep-Alive",
                    'Accept-Encoding': "gzip",
                    'Content-Type': "application/json",
                    'Cookie': cookie
                }
            }
        );
        const respond = JSON.stringify(response.data);

        api.sendMessage(respond, event.threadID);
    } catch (error) {
        console.error(error);
        api.sendMessage('An error occurred while fetching reactions.', event.threadID);
    }
};