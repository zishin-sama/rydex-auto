const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js'); 

let cachedData = null;
const filePath = path.join(__dirname, '..', 'cache', 'rydex.json');

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

let replyMode = false;

module.exports.config = {
    name: "rydex",
    version: "1.0.0",
    role: 0,
    description: "Talk to Rydex or toggle reply mode and teach",
    usage: "[message]",
    aliases: [],
    credits: "rydex",
    cooldown: 0
};

module.exports.run = async function ({ api, args, event }) {
    const command = args[0];
    const message = args.slice(1).join(" ");

    if (command === "on") {
        replyMode = true;
        return api.sendMessage("Reply mode turned on.", event.threadID);
    }
    
    if (command === "off") {
        replyMode = false;
        return api.sendMessage("Reply mode turned off.", event.threadID);
    }
    
    if (command === "teach") {
        const teachInput = message.split("=");
        if (teachInput.length !== 2) {
            return api.sendMessage("Usage: rydex teach <key> = <value>", event.threadID);
        }

        const key = teachInput[0].trim();
        const value = teachInput[1].trim();

        if (!key || !value) {
            return api.sendMessage("Usage: rydex teach <key> = <value>", event.threadID);
        }

        if (!cachedData[key]) {
            cachedData[key] = [];
        }
        cachedData[key].push(value);

        fs.writeFile(filePath, JSON.stringify(cachedData, null, 2), (err) => {
            if (err) {
                console.error(err);
                return api.sendMessage("Failed to save response. Please try again later.", event.threadID);
            }
            api.sendMessage(`Thank you for teaching me!\nMessage: ${key}\nResponse: ${value}`, event.threadID);
        });
        return;
    }

    if (message) {
        processMessage(api, message, event);
    }
};

module.exports.handleEvent = async function ({ api, event }) {
    if (!replyMode) {
        return;
    }

    const { body, messageID, threadID } = event;
    processMessage(api, body, event);
};

function processMessage(api, message, event) {
    const { threadID } = event;

    if (!cachedData) {
        return api.sendMessage("Failed to fetch response. Please try again later.", threadID);
    }

    const getRandomElement = arr => arr[Math.floor(Math.random() * arr.length)];

    if (cachedData[message]) {
        const response = getRandomElement(cachedData[message]);
        api.sendMessage(response, threadID);
        return;
    }

    const keys = Object.keys(cachedData);
    const fuse = new Fuse(keys, { includeScore: true, threshold: 0.3 });
    
    const results = fuse.search(message);

    if (results.length > 0) {
        const bestMatch = results[0].item;
        const response = getRandomElement(cachedData[bestMatch]);
        api.sendMessage(response, threadID);
    } else {
        const randomKey = getRandomElement(keys);
        const response = getRandomElement(cachedData[randomKey]);
        api.sendMessage(response, threadID);
    }
}
