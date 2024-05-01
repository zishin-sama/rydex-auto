const axios = require("axios");

module.exports.config = {
  name: "ai",
  version: "1.0.0",
  permission: 0,
  credits: "churchill",//api by hazey
  description: "snowhite api by hazey",
  commandCategory: "utility",
  usage: "ai <question>",
  cooldown: 5,
};

module.exports.handleEvent = async function ({ api, event, args }) {
  // Check if the user provided a question
  if (args.length === 0) {
    return api.sendMessage("Please provide a question.", event.threadID);
  }

  // Join the arguments into a single string
  const question = args.join(" ");

  try {
    // Call the AI API with the provided question
    const response = await axios.get(`https://haze-llm-model-74e9fe205264.herokuapp.com/snow?question=${encodeURIComponent(question)}`);

    // Send the AI's response back to the user
    api.sendMessage(response.data.response, event.threadID);
  } catch (error) {
    console.error("Error fetching AI response:", error);
    api.sendMessage("An error occurred while fetching the response from the AI.", event.threadID);
  }
};

module.exports.run = async function ({ api, event }) {};
