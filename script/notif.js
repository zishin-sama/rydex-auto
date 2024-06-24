module.exports.config = {
	name: "noti",
	version: "1.0.0",
	role: 1,
	description: "Sends a message to all groups and can only be done by the admin.",
	hasPrefix: true,
	aliases: ["snf"],
	usage: "[message]",
	cooldown: 0,
};

module.exports.run = async function ({ api, event, args, admin }) {
	const threadList = await api.getThreadList(100, null, ["INBOX"]);
	let sentCount = 0;
	const message = args.join(" ");
	const adminName = "Aze Kagenou";

	async function sendMessage(thread) {
		try {
			await api.sendMessage(
`┏━━「 NOTIFICATION 」━━┓\n\nMessage from the admin:\n\n${message}\n\n┗━━━━━━━━━━━━━┛
Admin Name: ${adminName}`,
				thread.threadID
			);
			sentCount++;

			const content = `${message}`;
			
		} catch (error) {
			console.error("Error sending a message:", error);
		}
	}

	for (const thread of threadList) {
		if (sentCount >= 20) {
			break;
		}
		if (thread.isGroup && thread.name != thread.threadID && thread.threadID != event.threadID) {
			await sendMessage(thread);
		}
	}

	if (sentCount > 0) {
		api.sendMessage(`Sent the notification successfully.`, event.threadID);
	} else {
		api.sendMessage(
			"No eligible group threads found to send the message to.",
			event.threadID
		);
	}
};