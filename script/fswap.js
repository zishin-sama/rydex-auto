"use strict";

module.exports.config = {
    name: "faceswap",
    version: "1.0.4",
    role: 0,
    credits: "Rydex",
    usage: "Reply to two images",
    description: "Swap faces of images",
    hasPrefix: true,
    aliases: ["fswap"],
    cooldown: 5
};

module.exports.run = async function({ api, event }) {
    function reply(a) {
        api.sendMessage(a, event.threadID, event.messageID);
    }

    try {
        const { Prodia } = require("prodia.js");
        const prodia = new Prodia("2b0e03f0-b307-4966-b060-cbb4186ebfe8");
        const axios = require("axios");
        const fs = require('fs');

        // Check if the message is a reply and contains attachments
        if (event.type === "message_reply" && event.messageReply.attachments.length > 0) {
            const attachments = event.messageReply.attachments;

            // Validate that there are exactly 2 images
            if (attachments.length !== 2) {
                return reply("Please reply with exactly 2 images.");
            }

            // Validate that both attachments are images
            if (attachments.some(attachment => attachment.type !== "photo")) {
                return reply("Only images are supported. Please reply with two image attachments.");
            }

            // Get the URLs of the two images
            const url1 = attachments[0].url;
            const url2 = attachments[1].url;

            reply("Processing...");

            // Send a request to perform face swap using Prodia API
            const generate = await prodia.faceSwap({
                sourceUrl: encodeURI(url1),
                targetUrl: encodeURI(url2)
            });

            // Poll for the job status
            while (generate.status !== "succeeded" && generate.status !== "failed") {
                await new Promise(resolve => setTimeout(resolve, 250));
                const job = await prodia.getJob(generate.job);

                if (job.status === "succeeded") {
                    // Download the generated image
                    const img = (await axios.get(job.imageUrl, { responseType: "arraybuffer" })).data;
                    const path = __dirname + '/cache/gen.png';
                    fs.writeFileSync(path, Buffer.from(img));

                    // Send the generated image as an attachment
                    return reply({ attachment: fs.createReadStream(path) });
                }
            }
        } else {
            return reply("Please reply to a message with exactly two image attachments.");
        }
    } catch (error) {
        return reply(`Error: ${error.message}`);
    }
};
