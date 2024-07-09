const fs = require('fs');
const path = require('path');
let cachedData = null;
const filePath = path.join(__dirname, '..', 'cache', 'aze.json');

function readData(callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return callback(err);
        }
        try {
            cachedData = JSON.parse(data);
            callback(null, cachedData);
        } catch (error) {
            console.error(error);
            callback(error);
        }
    });
}

readData((err) => {
    if (err) {
        console.error("Failed to fetch response at initialization.");
    } else {
        console.log("Data loaded successfully.");
    }
});

let replyAze = false;

module.exports.config = {
    name: "kazeu",
    version: "1.0",
    role: 0,
    description: "talk to aze",
    usage: "[message]",
    aliases: [],
    credits: "aze",
    hasPrefix: true,
    cooldown: 0
};

module.exports.run = async function ({ api, args, event }) {
    const input = args[0];
    const cmd = args[1];

    if (cmd === "teach") {
        const teachInput = args.slice(2).join(" ").split("=");
        const key = teachInput[0].trim();
        const value = teachInput[1].trim();

        if (cachedData[key]) {
            cachedData[key].push(value);
        } else {
            cachedData[key] = [value];
        }

        fs.writeFile(filePath, JSON.stringify(cachedData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return api.sendMessage("Failed to save response. Please try again later.", event.threadID);
            }
            api.sendMessage(`Message: ${key}\nResponse: ${value}`, event.threadID);
        });
    } else if (cmd === "on") {
        replyAze = true;
        return api.sendMessage("Aze reply mode turned on.", event.threadID);
    } else if (cmd === "off") {
        replyAze = false;
        return api.sendMessage("Aze reply mode turned off.", event.threadID);
    } else {
        if (!cachedData) {
            return api.sendMessage("Failed to fetch response. Please try again later.", event.threadID);
        }

        const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];

        if (cachedData[input]) {
            const response = getRandomElement(cachedData[input]);
            api.sendMessage(response, event.threadID);
        } else {
            let similarKey = '';
            let foundSimilar = false;

            Object.keys(cachedData).forEach(key => {
                if (key.includes(input) || input.includes(key)) {
                    similarKey = key;
                    foundSimilar = true;
                }
            });

            if (foundSimilar) {
                const response = getRandomElement(cachedData[similarKey]);
                api.sendMessage(response, event.threadID);
            } else {
                const randomKey = getRandomElement(Object.keys(cachedData));
                const response = getRandomElement(cachedData[randomKey]);
                api.sendMessage(response, event.threadID);
            }
        }
    }
};

module.exports.handleEvent = async function ({ api, event }) {
    if (!replyAze) {
        return;
    }

    if (event.type === "message_reply" && event.messageReply && event.messageReply.senderID === api.getCurrentUserID()) {
        const input = event.body;

        try {
            if (cachedData[input]) {
                const response = getRandomElement(cachedData[input]);
                api.sendMessage(response, event.threadID);
            } else {
                let similarKey = '';
                let foundSimilar = false;

                Object.keys(cachedData).forEach(key => {
                    if (key.includes(input) || input.includes(key)) {
                        similarKey = key;
                        foundSimilar = true;
                    }
                });

                if (foundSimilar) {
                    const response = getRandomElement(cachedData[similarKey]);
                    api.sendMessage(response, event.threadID);
                } else {
                    const randomKey = getRandomElement(Object.keys(cachedData));
                    const response = getRandomElement(cachedData[randomKey]);
                    api.sendMessage(response, event.threadID);
                }
            }
        } catch (error) {
            console.error("Error fetching response:", error);
        }
    }
};
