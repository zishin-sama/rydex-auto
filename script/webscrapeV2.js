const axios = require('axios');
const cheerio = require('cheerio');

module.exports.config = {
    name: "webscrape2",
    version: "2.1",
    role: 0,
    description: "Simple scraper of webpage including external JavaScript, and CSS code",
    usage: "webscrape2 [URL]",
    aliases: [],
    hasPrefix: true,
    cooldown: 5,
    credits: "aze"
};

module.exports.run = async function ({ api, event, args }) {
    const url = args[0];
    
    if (!url) {
        api.sendMessage("Please provide a URL to scrape", event.threadID, event.messageID);
        return;
    }
    
    try {
        const response = await axios.get(url);
        let htmlData = response.data;
        const $ = cheerio.load(htmlData);
        
        const scriptPromises = $('script[src]').map(async function() {
            const scriptUrl = $(this).attr('src');
            const scriptResponse = await axios.get(scriptUrl);
            return { url: scriptUrl, content: scriptResponse.data };
        }).get();
        
        const stylesheetPromises = $('link[rel="stylesheet"]').map(async function() {
            const stylesheetUrl = $(this).attr('href');
            const stylesheetResponse = await axios.get(stylesheetUrl);
            return { url: stylesheetUrl, content: stylesheetResponse.data };
        }).get();
        
        const [externalScripts, externalStylesheets] = await Promise.all([Promise.all(scriptPromises), Promise.all(stylesheetPromises)]);
        
        let responseData = { htmlData, externalScripts, externalStylesheets };
        responseData = JSON.stringify(responseData);
        api.sendMessage(`${responseData}`, event.threadID, event.messageID);
    } catch (e) {
        api.sendMessage(`${e.name}: ${e.message}`, event.threadID, event.messageID);
    }
};