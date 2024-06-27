const axios = require("axios");

module.exports.config = {
  name: "changedp",
  version: "1.0.0",
  hasPrefix: true,
  credits: "Aze Kagenou",
  description: "change profile of bot",
  usage: "reply to image",
  aliases: [],
  cooldown: 10,
  role: 0,
};

const changeAvatar = async (image, callback) => {
  try {
    const form = new FormData();
    form.append("profile_id", event.userID);
    form.append("photo_source", 57);
    form.append("av", event.userID);
    form.append("file", image);

    const response = await axios({
      method: "post",
      url: "https://www.facebook.com/profile/picture/upload/",
      data: form,
      headers: { 
        ...form.getHeaders()
      },
      jar: event.jar,
    });

    const form2 = {
      av: event.userID,
      fb_api_req_friendly_name: "ProfileCometProfilePictureSetMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "5066134240065849",
      variables: JSON.stringify({
        input: {
          existing_photo_id: response.data.payload.fbid,
          profile_id: event.userID,
          profile_pic_source: "TIMELINE",
          scaled_crop_rect: {
            height: 1,
            width: 1,
            x: 0,
            y: 0,
          },
          skip_cropping: true,
          actor_id: event.userID,
          client_mutation_id: Math.round(Math.random() * 19).toString(),
        },
        isPage: false,
        isProfile: true,
        scale: 3,
      }),
    };

    const response2 = await axios.post(
      "https://www.facebook.com/api/graphql/",
      form2,
      {
        headers: {
          Cookie: event.jar._jar.cookies.join("; "),
        },
      }
    );

    if (response2.data.errors) {
      throw response2.data;
    }

    callback(null, response2.data.data.profile_picture_set);
  } catch (err) {
    log.error("changeAvatar", err);
    callback(err);
  }
};

module.exports.run = async function ({ api, event }) {
  try {
    if (
      !event.messageReply ||
      !event.messageReply.attachments ||
      event.messageReply.attachments.length === 0 ||
      event.messageReply.attachments[0].type !== "photo"
    ) {
      api.sendMessage("Please reply to a photo to change the profile.", event.threadID);
      return;
    }

    const photoUrl = event.messageReply.attachments[0].url;
    const response = await axios.get(photoUrl, { responseType: "arraybuffer" });

    changeAvatar(response.data, (err, result) => {
      if (err) {
        api.sendMessage("Failed to change profile picture.", event.threadID);
      } else {
        api.sendMessage("Profile picture changed successfully!", event.threadID);
      }
    });
  } catch (err) {
    api.sendMessage("Failed to change profile picture.", event.threadID);
  }
};