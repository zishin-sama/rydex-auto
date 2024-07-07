module.exports.config = { 
  name: "bio", 
  version: "1.0.0", 
  description: "Change your bot bio", 
  role: 1, 
  credits: "aze kagenou", 
  hasPrefix: true, 
  usage: "bio [text]", 
  aliases: [], 
  cooldown: 5, 
}; 
module.exports.run = async function ({ api, event, args }) { 
  const newBio = args.join(" "); 
  
  if (!newBio) { 
    try { 
      await api.changeBio('', false); 
      api.sendMessage("Bot biography deleted.", event.threadID, event.messageID); 
    } catch (error) { 
      api.sendMessage("Failed to delete bio. Please try again.", event.threadID, event.messageID); 
    } 
  } else { 
    try { 
      await api.changeBio(newBio, false); 
      api.sendMessage("Set bot biography to: " + newBio, event.threadID, event.messageID); 
    } catch (error) { 
      api.sendMessage("Failed to change bio. Please try again.", event.threadID, event.messageID); 
    } 
  } 
}; 