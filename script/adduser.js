module.exports.config = { 
    name: "adduser", 
    version: "1.0.1", 
    role: 0, 
    credits: "cliff",
    description: "Add user to group by id", 
    hasPrefix: true, 
    aliases:["au"],
    usage: "[args]", 
    cooldown: 5 
}; 

module.exports.run = async function ({ api, event, args }) {
    const { threadID, messageID } = event;
    const botID = api.getCurrentUserID();
    const out = msg => api.sendMessage(msg, threadID, messageID);

    var { participantIDs, approvalMode, adminIDs } = await api.getThreadInfo(threadID);
    var participantIDs = participantIDs.map(e => parseInt(e));

    if (!args[0]) return out("Please enter an id/link profile user to add.");
    
    async function getUID(args, api) {
        if (args.includes("profile.php") || args.includes("facebook.com")) {
            const regex = /[?&]id=(\d+)/g;
            let match = regex.exec(args);
            return match[1];
        } else {
            let id = await api.getUserID(args);
            return id;
        }
    }

    if (!isNaN(args[0])) return adduser(args[0], undefined);
    else {
        try {
            var [id, name, fail] = await getUID(args[0], api);
            if (fail) {
                return out("User ID not found.");
            } else {
                await adduser(id, name || "Facebook user");
            }
        } catch (e) {
            return out(`${e.name}: ${e.message}.`);
        }
    }

    async function adduser(id, name) {
        id = parseInt(id);
        if (participantIDs.includes(id)) return out(`${name ? name : "Member"} is already in the group.`);
        else {
            var admins = adminIDs.map(e => parseInt(e.id));
            try {
                await api.addUserToGroup(id, threadID);
                return out(`Added ${name ? name : "member"} to the group !`);
            } catch {
                return out(`Can't add ${name ? name : "user"} to the group.`);
            }
        }
    }
}