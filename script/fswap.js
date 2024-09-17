"use strict";

module.exports.config = {
    name: "faceswap",
    version: "1.0.3",
    role: 0,
    credits: "Rydex",
    usage: "Reply to two images",
    description: "Swap faces of images",
    hasPrefix: true,
    aliases: ["fswap"],
    cooldown: 5
}

module.exports.run = async function({ api, event }) {
    function reply(a) {
      api.sendMessage(a, event.threadID, event.messageID);
    }

    try {
      const { Prodia } = require("prodia.js");
      const prodia = new Prodia("2b0e03f0-b307-4966-b060-cbb4186ebfe8");
      const axios = require("axios");
      const fs = require('fs');

      let attachments = event.attachments;
      let url, url1;

      if (event.type === "message_reply" && attachments.length > 0) {
        if (attachments.length !== 2) return reply("Please reply to 2 images to start.");

        if (attachments.forEach(attachment => attachment.type !== "photo")) {
          return reply("Only image can be converted.");
        }

        url = attachments[0].url;
        url1 = attachments[1].url;

        reply("Processing...");

        const generate = await prodia.faceSwap({
          sourceUrl: encodeURI(url),
          targetUrl: encodeURI(url1)
        });

        while (generate.status !== "succeeded" && generate.status !== "failed") {
          await new Promise((resolve) => setTimeout(resolve, 250));
          const job = await prodia.getJob(generate.job);

          if (job.status === "succeeded") {
            let img = (await axios.get(job.imageUrl, { responseType: "arraybuffer" })).data;
            let path = __dirname + '../cache/gen.png';
            fs.writeFileSync(path, Buffer.from(img, "utf-8"));

            return reply({ attachment: fs.createReadStream(path) });
          }
        }
      } else {
        return reply("Please reply to two images.");
      }
    } catch (e) {
      return reply(e.message);
  }
};