let antioutMode = true;

module.exports.config = { 
name: "antiout", 
version: "1.0.0" };

module.exports.run = async function({ 
api, 
args, 
event 
}) {
    if (args[0] === 'on') {
        antioutMode = true;
        api.sendMessage('Antiout mode enabled.', event.threadID);
    } else if (args[0] === 'off') {
        antioutMode = false;
        api.sendMessage('Antiout mode disabled.', event.threadID);
    } else {
        api.sendMessage('Invalid command. Please use "on" or "off".', event.threadID);
    }
};

module.exports.handleEvent = async function ({ event, api }) {
    if (!antioutMode) return;

    if (event.logMessageData?.leftParticipantFbId === api.getCurrentUserID()) return;

    if (event.logMessageData?.leftParticipantFbId) {
        const info = await api.getUserInfo(event.logMessageData?.leftParticipantFbId);
        const { name } = info[event.logMessageData?.leftParticipantFbId];

        api.addUserToGroup(event.logMessageData?.leftParticipantFbId, event.threadID, (error) => {
            if (error) {
                api.sendMessage(`Unable to re-add member ${name} to the group!`, event.threadID);
            } else {
                api.sendMessage(`Active antiout mode, ${name} has been re-added to the group successfully! HAHAHAHAHA wala kang takas dito boi.`, event.threadID);
            }
        });
    }
};