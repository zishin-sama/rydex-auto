module.exports.config = {
    name: "ai",
    description: "Talk to GPT (conversational)",
    hasPrefix: false,
    usage: "[ask]",
    role: 0
  };
  module.exports.run async function ({ text, reply, react, event}) {
    let p = text.join(' '), uid = event.senderID;
    const axios = require('axios');
    if (!p) return reply('Please enter a prompt.');
    try {
      const r = (await axios.get(`https://deku-rest-api-3ijr.onrender.com/gpt4?prompt=${p}&uid=${uid}`)).data;
      return reply(r.gpt4);
    } catch (g) {
      return reply(g.message);
    }
  }
}
