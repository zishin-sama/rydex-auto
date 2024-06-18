'use strict';

module.exports.config = {
  name: "faceswap",
  hasPrefix: true,
  credits: "Deku",
  description: "faceswap image",
  aliases: [],
  cooldown: 5,
  usage: "reply to two image",
};

module.exports.run = async function({ api, event }) {
  try {
    const { Prodia } = require("prodia.js");
    const prodia = new Prodia("59c81604-c7cd-4c59-a939-e11c151281b4");
    const axios = require("axios"),
      fs = require("fs");
    let url, url1;

    if (event.type == "message_reply") {
      if (event.messageReply.attachments.length < 1)
        return api.sendMessage("No image found.");

      if (event.messageReply.attachments[0].type !== "photo")
        return api.sendMessage("Only image can be converted.");

      url = event.messageReply.attachments[0].url;

      if (event.messageReply.attachments.length > 2)
        return api.sendMessage("Only 2 image can be converted.");

      url = event.messageReply.attachments[0].url;
      url1 = event.messageReply.attachments[1].url;

      api.sendMessage("Processing...");

      const generate = await prodia.faceSwap({
        sourceUrl: encodeURI(url),
        targetUrl: encodeURI(url1),
      });

      while (
        generate.status !== "succeeded" &&
        generate.status !== "failed"
      ) {
        new Promise((resolve) => setTimeout(resolve, 250));
        const job = await prodia.getJob(generate.job);

        if (job.status === "succeeded") {
          let img = (await axios.get(job.imageUrl, {
            responseType: "arraybuffer",
          })).data;
          let path = __dirname + "/cache/gen.png";
          fs.writeFileSync(path, Buffer.from(img, "utf-8"));

          return api.sendMessage({
            attachment: fs.createReadStream(path),
          });
        }
      }
    } else {
      return api.sendMessage("Please reply to an image.");
    }
  } catch (e) {
    return api.sendMessage(e.message);
  }
};
