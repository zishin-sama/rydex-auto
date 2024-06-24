const axios = require('axios');

module.exports = {
  name: "wikipedia",
  version: "1.1.2",
  role: 0,
  description: "search",
  aliases: ["wk"],
  usage: "wiki [q]",
  credits: "Aze Kagenou",
  hasPrefix: true,
  cooldown: 3
};
module.exports.run = async function({api, args, event}) {
    const q = args.join(" ");
    
    if(!q) {
    api.sendMessage("Please provide a query.", event.threadID);
    } else {
        const s = q;
        const u = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(s)}&format=json`;

        try {
          const response = await axios.get(u);
          const results = response.data.query.search;

          if (results.length > 0) {
          	
            const resultTitle = results[0].title;
            const resultSnippet = results[0].snippet;
            api.sendMessage(`Title: ${resultTitle}\nSnippet: ${resultSnippet}`, event.threadID);
          } else {
            api.sendMessage("No results found.", event.threadID);
          }
        } catch (error) {
          api.sendMessage("An error occurred while fetching data.", event.threadID);
        }
      }
    };