const { SupportedImageModels, RemoteImageModel, ImageModelInput } = require('intellinode');

module.exports.config = {
    name: "dalle",
    version: "1.0.0",
    role: 0,
    credits: "cliff",
    hasPrefix: false,
    description: "Generate images based on a prompt using DALL-E model.",
    usages: "<prompt>",
    cooldown: 5
};

module.exports.run = async function ({ api, event, args }) {
    const apiKey = "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"; 
    const provider = SupportedImageModels.OPENAI;
    
    if (args.length === 0) {
        return api.sendMessage("Please provide a prompt.", event.threadID);
    }

    const prompt = args.join(" ");
    
    try {
        const imgModel = new RemoteImageModel(apiKey, provider);
        const images = await imgModel.generateImages({
            prompt: prompt,
            numberOfImages: 1
        });

        const imageURL = images[0].url;
        api.sendMessage({ attachment: imageURL }, event.threadID);
    } catch (error) {
        console.error("Error generating image:", error);
        api.sendMessage("An error occurred while generating the image.", event.threadID);
    }
};
