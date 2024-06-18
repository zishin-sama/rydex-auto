module.exports.config = {
  name: 'prefix',
  version: "1",
  role: 0,
  hasPrefix: false,
  usage:"",
  aliases: [],
  description: 'Replies with the prefix'
};

module.exports.run = async function({api, event, args, prefix}) {
    try {
      api.sendMessage(`My prefix is: ${prefix}`, event.threadID);
    } catch (error) {
      console.error('Error executing command:', error);
      api.sendMessage('An error occurred.', event.threadID);
    }
  },
};
