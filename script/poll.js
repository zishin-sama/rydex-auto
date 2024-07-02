module.exports.config = {
  name: 'createpoll',
  version: '1',
  role: 0,
  hasPrefix: true,
  description: 'Create a poll in the current thread or group chat.',
  usage: '<title> | options separated by |',
  cooldown: 0,
  aliases: [],
  credits: 'aze'
};
module.exports.run = async function({ api, args, event }) {
  if (event.threadID && event.isGroup) {
    const input = args.join(' ').split(' | ');
    const title = input[0];
    const options = input.slice(1);
    api.createPoll(title, event.threadID, options, err => {
      if (err) {
        api.sendMessage('Failed to create poll. Please try again.', event.threadID);
        console.error(err);
      } else {
        api.sendMessage('Poll created successfully!', event.threadID);
      }
    });
  } else {
    api.sendMessage('This command can only be used in a group chat.', event.threadID);
  }
};