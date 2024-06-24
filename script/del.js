module.exports.config = {
  name: "delete",
  version: "1.0.2",
  credits: "Aze Kagenou",
  role: 3,
  description: "delete file",
  aliases: ["del", "rmf"],
  usage: "delete {filename}",
  hasPrefix: true,
  cooldown: 5
};

module.exports.run = async function({ api, event, args }) {
  const fs = require('fs');
  const path = require('path');
  const directoryPath = path.join(__dirname, 'script');
  
  const filenameToDelete = args.join(" "); 

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }

    const fileToDelete = files.find(file => file === filenameToDelete && file.endsWith('.js'));

    if (fileToDelete) {
      const filePath = path.join(directoryPath, fileToDelete);
      
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(err);
          api.sendMessage(`Failed to delete ${fileToDelete}.`, event.threadID);
          return;
        }
        
        api.sendMessage(`( ${fileToDelete} ) Deleted successfully!`, event.threadID);
      });
    } else {
      api.sendMessage(`File ${filenameToDelete} not found.`, event.threadID);
    }
  });
};