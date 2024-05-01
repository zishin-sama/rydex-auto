const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "1.0.0",
  permission: 0,
  credits: "churchill", // API by hazey
  description: "Ask a question to the Snowhite AI",
  commandCategory: "utility",
  usage: "ai <question>",
  cooldown: 5,
};

module.exports.handleEvent = async function ({ api, event, args }) {
  // Check if the event is a command and matches the command name
  if (event.body.toLowerCase().startsWith("ai")) {
    // Remove the command name from the arguments
    args.shift();

    // Check if the user provided a question
    if (args.length === 0) {
      return api.sendMessage("Please provide a question.", event.threadID);
    }

    // Join the arguments into a single string
    const question = args.join(" ");

    try {
      // Call the AI API with the provided question
      const response = await axios.get(`https://haze-llm-model-74e9fe205264.herokuapp.com/snow?question=${encodeURIComponent(question)}`);

      // Send the AI's response back to the user with the Facebook link
      const aiResponse = `${response.data.response}\n\nThis bot was made by Churchill: [Facebook Profile](https://www.facebook.com/Churchill.Dev4100)`;
      api.sendMessage(aiResponse, event.threadID);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      api.sendMessage("An error occurred while fetching the response from the AI.", event.threadID);
    }
  }
};

module.exports.run = async function ({ api, event }) {}; // Unused run function
