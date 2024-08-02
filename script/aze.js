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
    name: "aze",
    version: "1.0",
    role: 0,
    description: "Talk to aze or toggle reply mode",
    usage: "[message]",
    aliases: [],
    credits: "aze",
    hasPrefix: true,
    cooldown: 0
};

module.exports.run = async function ({ api, args, event }) {
    const command = args[0];
    const message = args.slice(1).join(" ");

    if (command === "on") {
        replyAze = true;
        return api.sendMessage("Aze reply mode turned on.", event.threadID);
    } else if (command === "off") {
        replyAze = false;
        return api.sendMessage("Aze reply mode turned off.", event.threadID);
    } else if (command === "teach") {
        const teachInput = message.split("=");
        const key = teachInput[0].trim();
        const value = teachInput[1].trim();

        if (!key || !value) {
            return api.sendMessage("Usage: aze teach <key> = <value>", event.threadID);
        }

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
    } else {
        // Default behavior: process the message
        if (message) {
            if (!cachedData) {
                return api.sendMessage("Failed to fetch response. Please try again later.", event.threadID);
            }

            const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];

            if (cachedData[message]) {
                const response = getRandomElement(cachedData[message]);
                api.sendMessage(response, event.threadID);
            } else {
                let similarKey = '';
                let foundSimilar = false;

                Object.keys(cachedData).forEach(key => {
                    if (key.includes(message) || message.includes(key)) {
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
        } else {
            api.sendMessage("Please provide a message or use 'aze on/off' to toggle the reply mode.", event.threadID);
        }
    }
};

module.exports.handleEvent = async function ({ api, event }) {
    if (!replyAze) {
        return;
    }

    const { body, messageID, threadID } = event;

    const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];

    try {
        if (cachedData[body]) {
            const response = getRandomElement(cachedData[body]);
            api.sendMessage(response, threadID, messageID);
        } else {
            let similarKey = '';
            let foundSimilar = false;

            Object.keys(cachedData).forEach(key => {
                if (key.includes(body) || body.includes(key)) {
                    similarKey = key;
                    foundSimilar = true;
                }
            });

            if (foundSimilar) {
                const response = getRandomElement(cachedData[similarKey]);
                api.sendMessage(response, threadID, messageID);
            } else {
                const randomKey = getRandomElement(Object.keys(cachedData));
                const response = getRandomElement(cachedData[randomKey]);
                api.sendMessage(response, threadID, messageID);
            }
        }
    } catch (error) {
        console.error("Error fetching response:", error);
    }
};
