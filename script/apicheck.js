const axios = require('axios');

module.exports.config = {
  name: "apicheck",
  version: "1.0",
  role: 0,
  description: "Check the status of an external API including endpoints",
  usage: "apicheck <METHOD> <API_URL>",
  aliases: [],
  hasPrefix: true,
  cooldown: 5,
  credits: "aze",
};

module.exports.run = async function ({ api, event, args }) {
  const method = args[0];
  const url = args[1];

   if (!method || !url) {
    api.sendMessage("Please provide a method and API URL to check", event.threadID, event.messageID);
    return;
  }

   const validMethods = ['GET', 'POST', 'PUT'];
  if (!validMethods.includes(method.toUpperCase())) {
    api.sendMessage("Unsupported method. Please use GET, POST, or PUT", event.threadID, event.messageID);
    return;
  }

   const apiUrl = encodeURI(url);
  try {
    let response;

     if (method.toUpperCase() === 'GET') {
      response = await axios.get(apiUrl);
    } else if (method.toUpperCase() === 'POST') {
      response = await axios.post(apiUrl);
    } else if (method.toUpperCase() === 'PUT') {
      response = await axios.put(apiUrl);
    }

     api.sendMessage(`Response from ${url}: ${response.data}`, event.threadID, event.messageID);
  } catch (error) {
      api.sendMessage(`Error checking API endpoint: ${error.message}`, event.threadID, event.messageID);
  }
};