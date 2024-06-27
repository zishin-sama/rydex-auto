const axios = require('axios');
const cheerio = require('cheerio');
module.exports = {
  name: "accept",
  run: async function ({ api, args, event }) {
    if (args[0] === 'list') {
      try {
        const response = await axios.post('https://www.facebook.com/ajax/friends/center/requests/', {}, {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept-Language': 'en-US,en;q=0.9,vi-VN;q=0.8,vi;q=0.7',
            'Accept': '*/*',
            'Origin': 'https://www.facebook.com',
            'Referer': 'https://www.facebook.com/friends/center/requests/',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299',
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Length': 0,
            'Connection': 'keep-alive',
            'Cookie': event.jar._jar.cookies[0].toString() // Use the cookie from the event.jar object
          }
        });
        const $ = cheerio.load(response.data);
        const requests = [];
        $('.UFIListItem').each((index, element) => {
          const name = $(element).find('.friendRequestName a').text();
          const uid = $(element).find('.friendRequestName a').attr('href').split('/')[2];
          const url = `https://www.facebook.com/${uid || ''}${uid ? '/' : ''}${name.replace(/\s/g, '')}`;
          requests.push({ name, uid, url });
        });
        let message = 'List of Friend Requests\n';
        requests.forEach((request, index) => {
          message += `${index + 1}. ${request.name} (UID: ${request.uid})\nLink: ${request.url}\n`;
        });
        message += `Use 'accept [number]' or 'accept [uid]' to accept the request.`;
        api.sendMessage(message, event.threadID);
      } catch (error) {
        console.error(error);
        api.sendMessage('Failed to fetch friend requests.', event.threadID);
      }
    }
    const accept = args[0] === "accept" && !isNaN(args[1]);
    const uid = accept ? args[1] : "";
    if (!args[0]) {
      return api.sendMessage(
        `Please use "accept list" to see friend request list or "accept [number]" to accept the friend request`,
        event.threadID
      );
    }
    try {
      const form = {
        action_type: "accept",
        friend_id: uid,
        fref: "friends_center",
        ref: "friends_center"
      };
      const response = await api.httpPost(
        "https://www.facebook.com/ajax/friends/add/confirm/",
        new URLSearchParams(form),
        { jar: event.jar }
      );
      if (response.success) {
        api.sendMessage(`Successfully accepted friend request!`, event.threadID);
      } else {
        api.sendMessage(
          `Failed to accept friend request: ${response.message}`,
          event.threadID
        );
      }
    } catch (error) {
      api.sendMessage(
        `Failed to accept friend request: ${error.message}`,
        event.threadID
      );
    }
  }
};