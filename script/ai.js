const axios = require('axios');

module.exports.config = {
  name: "ai",
  version: "1.0",
  hasPermssion: 0,
  credits: "churchill",
  description: "Ask a question to Snow AI.",
  commandCategory: "Utility",
  usages: "[question]",
  cooldowns: 3,
};

module.exports.handleEvent = async function ({ api, event }) {
  if (!(event.body.toLowerCase().startsWith("snow"))) return;

  const args = event.body.split(/\s+/);
  args.shift();

  if (args.length === 0) {
    api.sendMessage({ body: "Please provide a question to ask Snow AI." }, event.threadID);
    return;
  }

  const question = args.join(" ");

  try {
    api.sendMessage({ body: "Asking Snow AI, please wait..." }, event.threadID, event.messageID);

    const response = await axios.get(`https://haze-llm-model-74e9fe205264.herokuapp.com/snow?question=${encodeURIComponent(question)}`);

    if (response && response.data && response.data.answer) {
      const answer = response.data.answer;
      api.sendMessage({ body: `Snow AI's answer:\n\n${answer}` }, event.threadID, event.messageID);
    } else {
      console.error('Error: Invalid response from Snow AI API');
      api.sendMessage({ body: 'An error occurred while fetching the answer from Snow AI.' }, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error('Error:', error.message);
    api.sendMessage({ body: 'An error occurred while processing your request.' }, event.threadID, event.messageID);
  }
};

/*
module.exports.run = async function ({ api, event }) {
  // Logic for executing commands in the future
};
*/
