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

const changeAvatar = async (image, event, callback) => {
  try {
    const form = new FormData();
    form.append("profile_id", event.userID);
    form.append("photo_source", 57);
    form.append("av", event.userID);
    form.append("file", image, "profile_picture.jpg");

    const response = await api.httpPostFormData(
      "https://www.facebook.com/profile/picture/upload/",
      form,
      {
        "Content-Type": "multipart/form-data",
      }
    );

    const form2 = {
      av: event.userID,
      fb_api_req_friendly_name: "ProfileCometProfilePictureSetMutation",
      fb_api_caller_class: "RelayModern",
      doc_id: "5066134240065849",
      variables: JSON.stringify({
        input: {
          existing_photo_id: response.payload.fbid,
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

    const response2 = await api.httpPost(
      "https://www.facebook.com/api/graphql/",
      form2,
      {
        Cookie: event.cookie,
      }
    );

    if (response2.errors) {
      throw response2;
    }

    callback(null, response2.data.data.profile_picture_set);
  } catch (err) {
    console.error("changeAvatar", err);
    callback(err);
  }
};

module.exports.run = async function ({ api, event }) {
  try {
    if (event.type === "message_reply") {
      if (event.messageReply.attachments[0].type === "photo") {
        const photoUrl = event.messageReply.attachments[0].url;
        const response = await api.get(photoUrl, {
          responseType: "arraybuffer",
        });

        changeAvatar(response.data, event, (err, result) => {
          if (err) {
            api.sendMessage("Failed to change profile picture.", event.threadID);
          } else {
            api.sendMessage("Profile picture changed successfully!", event.threadID);
          }
        });
      } else {
        api.sendMessage("Please reply to a photo to change profile picture.", event.threadID);
      }
    }
  } catch (err) {
    console.error("Failed to change profile picture.", event.threadID);
  }
};