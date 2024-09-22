const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
const moment = require('moment-timezone');
const admin = "100064714842032";
const LAST_POST_FILE = path.join(__dirname, 'last_post_time.json'); // File to store last post time
const STATE_FILE = path.join(__dirname, 'autopost_state.json'); // File to store auto-posting state

let cronJob = null;

async function fetchQuote() {
  const api_url = "https://zenquotes.io/api/quotes/";
  try {
    const response = await axios.get(api_url);
    const data = response.data;
    if (Array.isArray(data) && data.length > 0) {
      const quote = data[0].q;
      const author = data[0].a;
      return `${quote}\n\n— ${author}`;
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
    return null;
  }
}

async function postToFacebook(api, message) {
  const formData = {
    input: {
      composer_entry_point: "inline_composer",
      composer_source_surface: "timeline",
      idempotence_token: getGUID() + "_FEED",
      source: "WWW",
      attachments: [],
      audience: {
        privacy: {
          allow: [],
          base_state: "EVERYONE",
          deny: [],
          tag_expansion_state: "UNSPECIFIED"
        }
      },
      message: { text: message },
      with_tags_ids: [],
      inline_activities: [],
      explicit_place_id: "0",
      text_format_preset_id: "0",
      logging: { composer_session_id: getGUID() },
      tracking: [null],
      actor_id: api.getCurrentUserID(),
      client_mutation_id: Math.floor(Math.random() * 17)
    }
  };

  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "ComposerStoryCreateMutation",
    fb_api_caller_class: "RelayModern",
    doc_id: "7711610262190099",
    variables: JSON.stringify(formData)
  };

  try {
    const response = await api.httpPost('https://www.facebook.com/api/graphql/', form);
    const data = JSON.parse(response.replace("for (;;);", ""));
    if (data.errors) throw new Error(JSON.stringify(data.errors));
    const postID = data.data.story_create.story.legacy_story_hideable_id;
    const urlPost = data.data.story_create.story.url;
  } catch (error) {
    console.error("Error posting to Facebook:", error);
    api.sendMessage("Failed to auto post quote.", admin);
  }
}

function getGUID() {
  let sectionLength = Date.now();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    return (c === "x" ? r : (r & 7) | 8).toString(16);
  });
}

function readLastPostTime() {
  try {
    if (fs.existsSync(LAST_POST_FILE)) {
      const data = fs.readFileSync(LAST_POST_FILE, 'utf-8');
      return new Date(JSON.parse(data).lastPostTime);
    }
  } catch (error) {
    console.error("Error reading last post time:", error);
  }
  return new Date(0); // Return epoch time if no valid data found
}

function writeLastPostTime(date) {
  try {
    fs.writeFileSync(LAST_POST_FILE, JSON.stringify({ lastPostTime: date }));
  } catch (error) {
    console.error("Error writing last post time:", error);
  }
}

function readAutoPostState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = fs.readFileSync(STATE_FILE, 'utf-8');
      return JSON.parse(data).enabled;
    }
  } catch (error) {
    console.error("Error reading auto-post state:", error);
  }
  return false;
}

function writeAutoPostState(enabled) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify({ enabled }));
  } catch (error) {
    console.error("Error writing auto-post state:", error);
  }
}

function startAutoPosting(api) {
  if (!cronJob) {
    cronJob = cron.schedule('0 */10 * * * *', async () => {
      const now = moment().tz('Asia/Manila'); // Get current time in Philippine timezone
      console.log(`Auto-posting job running at: ${now.format('YYYY-MM-DD HH:mm:ss')}`);
      
      const quote = await fetchQuote();
      if (quote) {
        await postToFacebook(api, quote);
        writeLastPostTime(new Date());
      }
    }, {
      timezone: "Asia/Manila" // Set the cron job to use Philippine timezone
    });

    cronJob.start(); // Start the cron job
  }
}


module.exports.config = {
  name: "autopostquotes",
  version: "1.1.0",
  role: 1,
  description: "Auto post quote to facebook",
  aliases: ["apq"],
  usage: "on/off/status",
  hasPrefix: true,
  credits: "rydex",
  cooldown: 0
};

module.exports.handleEvent = async function ({ api, event }) {
  const isEnabled = readAutoPostState();
  if (isEnabled) {
    if (!cronJob) {
      startAutoPosting(api);
    }
  } else if (cronJob) {
    cronJob.stop();
    cronJob = null;
  }
};

module.exports.run = async function ({ api, args, event }) {
  try {
    if (!args[0]) {
    	api.sendMessage('Invalid usage!', event.threadID);
    }
    if (args[0] === 'on') {
      writeAutoPostState(true);
      if (!cronJob) {
        startAutoPosting(api);
      }
      api.sendMessage("Autopost—quotes enabled.", event.threadID);
    } else if (args[0] === 'off') {
      writeAutoPostState(false);
      if (cronJob) {
        cronJob.stop();
        cronJob = null;
      }
      api.sendMessage("Autopost—quotes disabled.", event.threadID);
    } else if (args[0] === 'status') {
      const isEnabled = readAutoPostState();
      const status = isEnabled ? "enabled" : "disabled";
      api.sendMessage(`Autopost—quotes is currently ${status}.`, event.threadID);
    } else {
      api.sendMessage("Usage:\n- autopost on\n- autopost off\n- autopost status", event.threadID);
    }
  } catch (error) {
    console.error("Error handling command:", error);
    api.sendMessage("An error occurred while processing your request. Please try again later.", event.threadID);
  }
};
