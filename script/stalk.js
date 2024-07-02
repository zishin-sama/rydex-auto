const axios = require('axios');
const fs = require('fs');

module.exports.config = { 
  name: "stalk",
  version: "1.0.0",
  role: 0,
  description: "Stalk user",
  hasPrefix: true,
  usage: "{p}{n} reply to message/[uid]",
  aliases: [],
  credits: "aze",
  cooldown: 0
};

module.exports.run = async function ({ api, args, event }) {
  if (Object.keys(event.mentions).length === 0) {
    try {
      let target;
      
      if (event.type === "message_reply") {
        target = event.messageReply.senderID;
      } else {
        const mention = event.mentions[Object.keys(event.mentions)[0]];

        if (mention) {
          target = mention.id;
        } else {
          target = args[0];
        }
      }

      const userInfo = await api.getUserInfo(target);
      const userObj = userInfo[target];
      
      const userName = userObj ? (userObj.name || "Name not available") : "Name not available";
      const userUID = target;
      const userGender = userObj ? (userObj.gender === 1 ? "Male" : userObj.gender === 2 ? "Female" : "Gender not available") : "Gender not available";
      const userBirthday = userObj ? (userObj.birthday || "Birthday not available") : "Birthday not available";
      const userStatus = userObj ? (userObj.isOnline ? "Online 🟢" : "Offline 🔴") : "Status not available";
      const areFriends = userObj ? (userObj.isFriend ? "Yes ✅" : "No ❌") : "Friendship status not available";
      const fbLink = `https://www.facebook.com/profile.php?id=${userUID}`;
      
      const avatarResponse = await axios.get(`https://graph.facebook.com/${target}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`, { responseType: 'arraybuffer' });
      fs.writeFileSync('cache/avt.png', Buffer.from(avatarResponse.data, 'binary'));
      
      const formattedMention = { 
        body: `━━━━━𝗨𝗦𝗘𝗥 𝗜𝗡𝗙𝗢━━━━━\n\nUser Name: ${userName}\nUser UID: ${userUID}\nGender: ${userGender}\nBirthday: ${userBirthday}\nStatus: ${userStatus}\nFriends: ${areFriends}\nFacebook Profile: ${fbLink}`, 
        attachment: fs.createReadStream('cache/avt.png')
      };
      
      api.sendMessage(formattedMention, event.threadID);
    } catch (error) {
      console.log(error);
    }
  }
};