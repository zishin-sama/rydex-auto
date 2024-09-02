const fs = require('fs');
const path = require('path');
const Fuse = require('fuse.js');

let cachedData = null;
let replyMode = false; // Initial state for reply mode
const filePath = path.join(__dirname, '..', 'cache', 'rydex.json');
const stateFilePath = path.join(__dirname, '..', 'cache', 'rydex_state.json');

// Function to read data from the cache file
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

// Function to read the state from the state file
function readState(callback) {
    fs.readFile(stateFilePath, 'utf8', (err, data) => {
        if (err) {
            if (err.code === 'ENOENT') {
                return callback(null, false); // File not found, default to false
            }
            console.error(err);
            return callback(err);
        }
        try {
            const state = JSON.parse(data);
            callback(null, state.replyMode);
        } catch (error) {
            console.error(error);
            callback(error);
        }
    });
}

// Function to save the current state to the state file
function saveState() {
    const state = { replyMode };
    fs.writeFile(stateFilePath, JSON.stringify(state, null, 2), (err) => {
        if (err) {
            console.error("Failed to save state:", err);
        }
    });
}

// Initial read of the data and state
readData((err) => {
    if (err) {
        console.error("Failed to fetch response at initialization.");
    } else {
        console.log("Data loaded successfully.");
    }
});

readState((err, state) => {
    if (err) {
        console.error("Failed to fetch state at initialization.");
    } else {
        replyMode = state;
        console.log(`Rydex reply mode is ${replyMode ? 'ON' : 'OFF'} at initialization.`);
    }
});

module.exports.config = {
    name: "rydex",
    version: "1.0.0",
    role: 0,
    description: "Talk to Rydex or toggle reply mode and teach",
    usage: "[message]",
    aliases: ["kazeu"],
    credits: "rydex",
    cooldown: 0
};

module.exports.run = async function ({ api, args, event }) {
    const command = args[0]?.toLowerCase();
    const message = args.slice(1).join(" ");

    // Toggle reply mode
    if (command === "on") {
        replyMode = true;
        saveState();
        return api.sendMessage("Rydex reply mode turned on.", event.threadID);
    }

    if (command === "off") {
        replyMode = false;
        saveState();
        return api.sendMessage("Rydex reply mode turned off.", event.threadID);
    }

    // Show the current status of reply mode
    if (command === "status") {
        return api.sendMessage(`Rydex reply mode is currently ${replyMode ? 'ON' : 'OFF'}.`, event.threadID);
    }

    // Teach the bot
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

    // Default message processing
    processMessage(api, message || command, event);
};

module.exports.handleEvent = async function ({ api, event }) {
    if (!replyMode || event.type !== "message_reply" || event.senderID === api.getCurrentUserID()) {
        return;
    }

    const { body } = event;
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
