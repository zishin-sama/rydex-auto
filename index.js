const fs = require('fs');
const path = require('path');
const login = require('./fb-chat-api/index');
const express = require('express');
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const axios = require('axios');
const script = path.join(__dirname, 'script');
const moment = require("moment-timezone");
const cron = require('node-cron');
const config = fs.existsSync('./data') && fs.existsSync('./data/config.json') ? JSON.parse(fs.readFileSync('./data/config.json', 'utf8')) : creatqeConfig();
const Utils = new Object({
	commands: new Map(),
	handleEvent: new Map(),
	account: new Map(),
	cooldowns: new Map(),
});
fs.readdirSync(script).forEach((file) => {
	const scripts = path.join(script, file);
	const stats = fs.statSync(scripts);
	if (stats.isDirectory()) {
		fs.readdirSync(scripts).forEach((file) => {
			try {
				const {
					config,
					run,
					handleEvent
				} = require(path.join(scripts, file));
				if (config) {
					const {
						name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], description = '', usage = '', credits = '', cooldown = '5'
					} = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));
					aliases.push(name);
					if (run) {
						Utils.commands.set(aliases, {
							name,
							role,
							run,
							aliases,
							description,
							usage,
							version,
							hasPrefix: config.hasPrefix,
							credits,
							cooldown
						});
					}
					if (handleEvent) {
						Utils.handleEvent.set(aliases, {
							name,
							handleEvent,
							role,
							description,
							usage,
							version,
							hasPrefix: config.hasPrefix,
							credits,
							cooldown
						});
					}
				}
			} catch (error) {
				console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
			}
		});
	} else {
		try {
			const {
				config,
				run,
				handleEvent
			} = require(scripts);
			if (config) {
				const {
					name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], description = '', usage = '', credits = '', cooldown = '5'
				} = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));
				aliases.push(name);
				if (run) {
					Utils.commands.set(aliases, {
						name,
						role,
						run,
						aliases,
						description,
						usage,
						version,
						hasPrefix: config.hasPrefix,
						credits,
						cooldown
					});
				}
				if (handleEvent) {
					Utils.handleEvent.set(aliases, {
						name,
						handleEvent,
						role,
						description,
						usage,
						version,
						hasPrefix: config.hasPrefix,
						credits,
						cooldown
					});
				}
			}
		} catch (error) {
			console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
		}
	}
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());
	app.get('/', (req, res) => {
		res.sendFile(path.join(__dirname, 'public', 'index.html'));
	});
app.get('/info', (req, res) => {
	const data = Array.from(Utils.account.values()).map(account => ({
		name: account.name,
		profileUrl: account.profileUrl,
		thumbSrc: account.thumbSrc,
		time: account.time
	}));
	res.json(JSON.parse(JSON.stringify(data, null, 2)));
});
app.get('/commands', (req, res) => {
	const command = new Set();
	const commands = [...Utils.commands.values()].map(({
		name
	}) => (command.add(name), name));
	const handleEvent = [...Utils.handleEvent.values()].map(({
		name
	}) => command.has(name) ? null : (command.add(name), name)).filter(Boolean);
	const role = [...Utils.commands.values()].map(({
		role
	}) => (command.add(role), role));
	const aliases = [...Utils.commands.values()].map(({
		aliases
	}) => (command.add(aliases), aliases));
	res.json(JSON.parse(JSON.stringify({
		commands,
		handleEvent,
		role,
		aliases
	}, null, 2)));
});
app.post('/login', async (req, res) => {
	const {
		state,
		commands,
		prefix,
		admin
	} = req.body;
	try {
		if (!state) {
			throw new Error('Missing app state data');
		}
		const cUser = state.find(item => item.key === 'c_user');
		if (cUser) {
			const existingUser = Utils.account.get(cUser.value);
			if (existingUser) {
				console.log(`User ${cUser.value} is already logged in`);
				return res.status(400).json({
					error: false,
					message: "Active user session detected; already logged in",
					user: existingUser
				});
			} else {
				try {
					await accountLogin(state, commands, prefix, [admin]);
					res.status(200).json({
						success: true,
						message: 'Authentication process completed successfully; login achieved.'
					});
				} catch (error) {
					console.error(error);
					res.status(400).json({
						error: true,
						message: error.message
					});
				}
			}
		} else {
			return res.status(400).json({
				error: true,
				message: "There's an issue with the appstate data; it's invalid."
			});
		}
	} catch (error) {
		return res.status(400).json({
			error: true,
			message: "There's an issue with the appstate data; it's invalid."
		});
	}
});
const port = process.env.PORT || 10000;
app.listen(port, () => {
	console.log(`${port}`);
});
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled Promise Rejection:', reason);
});
async function accountLogin(state, enableCommands = [], prefix, admin = []) {
	return new Promise((resolve, reject) => {
		login({
			appState: state
		}, async (error, api) => {
			if (error) {
				reject(error);
				return;
			}
			const userid = await api.getCurrentUserID();
			addThisUser(userid, enableCommands, state, prefix, admin);
			try {
				const userInfo = await api.getUserInfo(userid);
				if (!userInfo || !userInfo[userid]?.name || !userInfo[userid]?.profileUrl || !userInfo[userid]?.thumbSrc) throw new Error('Unable to locate the account; it appears to be in a suspended or locked state.');
				const {
					name,
					profileUrl,
					thumbSrc
				} = userInfo[userid];
				let time = (JSON.parse(fs.readFileSync('./data/history.json', 'utf-8')).find(user => user.userid === userid) || {}).time || 0;
				Utils.account.set(userid, {
					name,
					profileUrl,
					thumbSrc,
					time: time
				});
				const intervalId = setInterval(() => {
					try {
						const account = Utils.account.get(userid);
						if (!account) throw new Error('Account not found');
						Utils.account.set(userid, {
							...account,
							time: account.time + 1
						});
					} catch (error) {
						clearInterval(intervalId);
						return;
					}
				}, 1000);
			} catch (error) {
				reject(error);
				return;
			}
			api.setOptions({
				listenEvents: config[0].fcaOption.listenEvents,
				logLevel: config[0].fcaOption.logLevel,
				updatePresence: config[0].fcaOption.updatePresence,
				selfListen: config[0].fcaOption.selfListen,
				forceLogin: config[0].fcaOption.forceLogin,
				online: config[0].fcaOption.online,
				autoMarkDelivery: config[0].fcaOption.autoMarkDelivery,
				autoMarkRead: config[0].fcaOption.autoMarkRead,
			});
			try {
				var listenEmitter = api.listenMqtt(async (error, event) => {
					if (error) {
						if (error === 'Connection closed.') {
							console.error(`Error during API listen: ${error}`, userid);
						}
						console.log(error)
					}
					let database = fs.existsSync('./data/database.json') ? JSON.parse(fs.readFileSync('./data/database.json', 'utf8')) : createDatabase();
					let data = Array.isArray(database) ? database.find(item => Object.keys(item)[0] === event?.threadID) : {};
					let adminIDS = data ? database : createThread(event.threadID, api);
					let blacklist = (JSON.parse(fs.readFileSync('./data/history.json', 'utf-8')).find(blacklist => blacklist.userid === userid) || {}).blacklist || [];
					let hasPrefix = (event.body && aliases((event.body || '')?.trim().toLowerCase().split(/ +/).shift())?.hasPrefix == false) ? '' : prefix;
					let [command, ...args] = ((event.body || '').trim().toLowerCase().startsWith(hasPrefix?.toLowerCase()) ? (event.body || '').trim().substring(hasPrefix?.length).trim().split(/\s+/).map(arg => arg.trim()) : []);
					if (hasPrefix && aliases(command)?.hasPrefix === false) {
						api.sendMessage(`Invalid usage this command doesn't need a prefix`, event.threadID, event.messageID);
						return;
					}
					if (event.body && aliases(command)?.name) {
						const role = aliases(command)?.role ?? 0;
						const isAdmin = config?.[0]?.masterKey?.admin?.includes(event.senderID) || admin.includes(event.senderID);
						const isThreadAdmin = isAdmin || ((Array.isArray(adminIDS) ? adminIDS.find(admin => Object.keys(admin)[0] === event.threadID) : {})?.[event.threadID] || []).some(admin => admin.id === event.senderID);
						if ((role == 1 && !isAdmin) || (role == 2 && !isThreadAdmin) || (role == 3 && !config?.[0]?.masterKey?.admin?.includes(event.senderID))) {
							api.sendMessage(`You don't have permission to use this command.`, event.threadID, event.messageID);
							return;
						}
					}
					if (event.body && event.body?.toLowerCase().startsWith(prefix.toLowerCase()) && aliases(command)?.name) {
						if (blacklist.includes(event.senderID)) {
							api.sendMessage("We're sorry, but you've been banned from using bot. If you believe this is a mistake or would like to appeal, please contact one of the bot admins for further assistance.", event.threadID, event.messageID);
							return;
						}
					}
					if (event.body !== null) {
						// Check if the message type is log:subscribe
						if (event.logMessageType === "log:subscribe") {
							const request = require("request");
							const moment = require("moment-timezone");
							var thu = moment.tz('Asia/Manila').format('dddd');
							if (thu == 'Sunday') thu = 'Sunday'
							if (thu == 'Monday') thu = 'Monday'
							if (thu == 'Tuesday') thu = 'Tuesday'
							if (thu == 'Wednesday') thu = 'Wednesday'
							if (thu == "Thursday") thu = 'Thursday'
							if (thu == 'Friday') thu = 'Friday'
							if (thu == 'Saturday') thu = 'Saturday'
							const time = moment.tz("Asia/Manila").format("HH:mm:ss - DD/MM/YYYY");										
							const fs = require("fs-extra");
							const { threadID } = event;
							const nameBot = documemt.getElementById('inputOfBotName');
							const botName = nameBot.value;
							const nameAdmin = document.getElementById('inputOfAdminName');
							const adminName = nameAdmin.value;

					if (event.logMessageData.addedParticipants && Array.isArray(event.logMessageData.addedParticipants) && event.logMessageData.addedParticipants.some(i => i.userFbId == userid)) {
					api.changeNickname(`${botName}`, threadID, userid);
					
let gifPath = __dirname + '/cache/connected.mp4';

axios.get(gifUrl, { responseType: 'arraybuffer' })
		.then(response => {
				fs.writeFileSync(gifPath, response.data); 
				return api.sendMessage("Initializing...", event.threadID, () => 
						api.sendMessage({
body: `「 Successfully Connected 」

➪ Bot Prefix: ${prefix}

➪ Admin: ${adminName}

➪ Use ${prefix}help to view commands list and details

➪ Added bot at: ${time} ${thu}`,attachment: fs.createReadStream(gifPath)}, 
event.threadID)
				);
		})
		.catch(error => {
				console.error(error);
		});
							} else {
								try {
									const fs = require("fs-extra");
									let { threadName, participantIDs } = await api.getThreadInfo(threadID);

									var mentions = [], nameArray = [], memLength = [], userID = [], i = 0;

									let addedParticipants1 = event.logMessageData.addedParticipants;
									for (let newParticipant of addedParticipants1) {
										let userID = newParticipant.userFbId;
										api.getUserInfo(parseInt(userID), (err, data) => {
											if (err) { return console.log(err); }
											var obj = Object.keys(data);
											var userName = data[obj].name.replace("@", "");
											if (userID !== api.getCurrentUserID()) {

												nameArray.push(userName);
												mentions.push({ tag: userName, id: userID, fromIndex: 0 });

												memLength.push(participantIDs.length - i++);
												memLength.sort((a, b) => a - b);

													(typeof threadID.customJoin == "undefined") ? msg = "🌟 Hi!, {uName}\n┌────── ～●～ ──────┐\n----- Welcome to {threadName} -----\n└────── ～●～ ──────┘\nYou're the {soThanhVien} member of this group, please enjoy! 🥳♥" : msg = threadID.customJoin;
													msg = msg
														.replace(/\{uName}/g, nameArray.join(', '))
														.replace(/\{type}/g, (memLength.length > 1) ? 'you' : 'Friend')
														.replace(/\{soThanhVien}/g, memLength.join(', '))
														.replace(/\{threadName}/g, threadName);
													let callback = function() {
														return api.sendMessage({ body: msg, attachment: fs.createReadStream(__dirname + `/cache/come.jpg`), mentions }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/come.jpg`))
													};
												request(encodeURI(`https://api.popcat.xyz/welcomecard?background=${sheshh}&text1=${userName}&text2=Welcome+To+${threadName}&text3=You+Are+The${participantIDs.length}th+Member&avatar=${yawa}`)).pipe(fs.createWriteStream(__dirname + `/cache/come.jpg`)).on("close", callback);
																			}
																		})
																	}
																} catch (err) {
																	return console.log("ERROR: " + err);
						}
					 }
					}
					}
					if (event.body !== null) {
							if (event.logMessageType === "log:unsubscribe") {
									api.getThreadInfo(event.threadID).then(({ participantIDs }) => {
											let leaverID = event.logMessageData.leftParticipantFbId;
											api.getUserInfo(leaverID, (err, userInfo) => {
													if (err) {
															return console.error('Failed to get user info:', err);
													}
													const name = userInfo[leaverID].name;
													const type = (event.author == event.logMessageData.leftParticipantFbId) ? "left the group." : "was kicked by Admin of the group";

													const link = ["https://i.imgur.com/dVw3IRx.gif"];
													const gifPath = __dirname + "/cache/leave.gif";

													// Assuming the file exists, send the message with the GIF
													api.sendMessage({ body: `${name} ${type}, There are now ${participantIDs.length} members in the group, please enjoy!`, attachment: fs.createReadStream(gifPath) }, event.threadID);
											});
									});
							}
					}
					 if (event.body && aliases(command)?.name) {
						const now = Date.now();
						const name = aliases(command)?.name;
						const sender = Utils.cooldowns.get(`${event.senderID}_${name}_${userid}`);
						const delay = aliases(command)?.cooldown ?? 0;
						if (!sender || (now - sender.timestamp) >= delay * 1000) {
							Utils.cooldowns.set(`${event.senderID}_${name}_${userid}`, {
								timestamp: now,
								command: name
							});
						} else {
							const active = Math.ceil((sender.timestamp + delay * 1000 - now) / 1000);
							api.sendMessage(`Please wait ${active} seconds before using the "${name}" command again.`, event.threadID, event.messageID);
							return;
						}
					}
					if (event.body && !command && event.body?.toLowerCase().startsWith(prefix.toLowerCase())) {
						api.sendMessage(`Invalid command please use ${prefix}help to see the list of available commands.`, event.threadID, event.messageID);
						return;
					}
if (event.body && !command && event.body?.toLowerCase().startsWith(prefix.toLowerCase())) {
		api.sendMessage(`Invalid command please use ${prefix}help to see the list of available commands.`, event.threadID, event.messageID);
		return;
}
if (event.body && command && prefix && event.body?.toLowerCase().startsWith(prefix.toLowerCase()) && !aliases(command)?.name) {
						api.sendMessage(`Invalid command '${command}' please use '${prefix}help all' to see the list of available commands.`, event.threadID, event.messageID);
						return;
					}
					for (const {
							handleEvent,
							name
						}
						of Utils.handleEvent.values()) {
						if (handleEvent && name && (
								(enableCommands[1].handleEvent || []).includes(name) || (enableCommands[0].commands || []).includes(name))) {
							handleEvent({
								api,
								event,
								enableCommands,
								admin,
								prefix,
								blacklist
							});
						}
					}
					switch (event.type) {
						case 'message':
						case 'message_reply':
						case 'message_unsend':
						case 'message_reaction':
							if (enableCommands[0].commands.includes(aliases(command?.toLowerCase())?.name)) {
								await ((aliases(command?.toLowerCase())?.run || (() => {}))({
									api,
									event,
									args,
									enableCommands,
									admin,
									prefix,
									blacklist,
									Utils,
								}));
							}
							break;
					}
				});
			} catch (error) {
				console.error('Error during API listen, outside of listen', userid);
				Utils.account.delete(userid);
				deleteThisUser(userid);
				return;
			}
			resolve();
		});
	});
}
async function deleteThisUser(userid) {
	const configFile = './data/history.json';
	let config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
	const sessionFile = path.join('./data/session', `${userid}.json`);
	const index = config.findIndex(item => item.userid === userid);
	if (index !== -1) config.splice(index, 1);
	fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
	try {
		fs.unlinkSync(sessionFile);
	} catch (error) {
		console.log(error);
	}
}
async function addThisUser(userid, enableCommands, state, prefix, admin, blacklist) {
	const configFile = './data/history.json';
	const sessionFolder = './data/session';
	const sessionFile = path.join(sessionFolder, `${userid}.json`);
	if (fs.existsSync(sessionFile)) return;
	const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
	config.push({
		userid,
		prefix: prefix || "",
		admin: admin || [],
		blacklist: blacklist || [],
		enableCommands,
		time: 0,
	});
	fs.writeFileSync(configFile, JSON.stringify(config, null, 2));
	fs.writeFileSync(sessionFile, JSON.stringify(state));
}

function aliases(command) {
	const aliases = Array.from(Utils.commands.entries()).find(([commands]) => commands.includes(command?.toLowerCase()));
	if (aliases) {
		return aliases[1];
	}
	return null;
}
async function main() {
	const empty = require('fs-extra');
	const cacheFile = './script/cache';
	if (!fs.existsSync(cacheFile)) fs.mkdirSync(cacheFile);
	const configFile = './data/history.json';
	if (!fs.existsSync(configFile)) fs.writeFileSync(configFile, '[]', 'utf-8');
	const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
	const sessionFolder = path.join('./data/session');
	if (!fs.existsSync(sessionFolder)) fs.mkdirSync(sessionFolder);
	const adminOfConfig = fs.existsSync('./data') && fs.existsSync('./data/config.json') ? JSON.parse(fs.readFileSync('./data/config.json', 'utf8')) : createConfig();
		cron.schedule(`*/${adminOfConfig[0].masterKey.restartTime} * * * *`, async () => {
		const history = JSON.parse(fs.readFileSync('./data/history.json', 'utf-8'));
		history.forEach(user => {
			(!user || typeof user !== 'object') ? process.exit(1): null;
			(user.time === undefined || user.time === null || isNaN(user.time)) ? process.exit(1): null;
			const update = Utils.account.get(user.userid);
			update ? user.time = update.time : null;
		});
		await empty.emptyDir(cacheFile);
		await fs.writeFileSync('./data/history.json', JSON.stringify(history, null, 2));
		process.exit(1);
	});
	try {
		for (const file of fs.readdirSync(sessionFolder)) {
			const filePath = path.join(sessionFolder, file);
			try {
				const {
					enableCommands,
					prefix,
					admin,
					blacklist
				} = config.find(item => item.userid === path.parse(file).name) || {};
				const state = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
				if (enableCommands) await accountLogin(state, enableCommands, prefix, admin, blacklist);
			} catch (error) {
				deleteThisUser(path.parse(file).name);
			}
		}
	} catch (error) {}
}

function createConfig() {
	const config = [{
		masterKey: {
			admin: [],
			devMode: false,
			database: false,
			restartTime: 9999999
		},
		fcaOption: {
			forceLogin: true,
			listenEvents: true,
			logLevel: "silent",
			updatePresence: true,
			selfListen: false,
			userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64",
			online: true,
			autoMarkDelivery: false,
			autoMarkRead: false
		}
	}];
	const dataFolder = './data';
	if (!fs.existsSync(dataFolder)) fs.mkdirSync(dataFolder);
	fs.writeFileSync('./data/config.json', JSON.stringify(config, null, 2));
	return config;
}
async function createThread(threadID, api) {
	try {
		const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
		let threadInfo = await api.getThreadInfo(threadID);
		let adminIDs = threadInfo ? threadInfo.adminIDs : [];
		const data = {};
		data[threadID] = adminIDs
		database.push(data);
		await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
		return database;
	} catch (error) {
		console.log(error);
	}
}
async function createDatabase() {
	const data = './data';
	const database = './data/database.json';
	if (!fs.existsSync(data)) {
		fs.mkdirSync(data, {
			recursive: true
		});
	}
	if (!fs.existsSync(database)) {
		fs.writeFileSync(database, JSON.stringify([]));
	}
	return database;
}
async function updateThread(id) {
	const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
	const user = database[1]?.Users.find(user => user.id === id);
	if (!user) {
		return;
	}
	user.exp += 1;
	await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2));
}
const Experience = {
	async levelInfo(id) {
		const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
		const data = database[1].Users.find(user => user.id === id);
		if (!data) {
			return;
		}
		return data;
	},
	async levelUp(id) {
		const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
		const data = database[1].Users.find(user => user.id === id);
		if (!data) {
			return;
		}
		data.level += 1;
		await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
		return data;
	}
}
const Currencies = {
	async update(id, money) {
		try {
			const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
			const data = database[1].Users.find(user => user.id === id);
			if (!data || !money) {
				return;
			}
			data.money += money;
			await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
			return data;
		} catch (error) {
			console.error('Error updating Currencies:', error);
		}
	},
	async increaseMoney(id, money) {
		try {
			const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
			const data = database[1].Users.find(user => user.id === id);
			if (!data) {
				return;
			}
			if (data && typeof data.money === 'number' && typeof money === 'number') {
				data.money += money;
			}
			await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
			return data;
		} catch (error) {
			console.error('Error checking Currencies:', error);
		}
	},
	async decreaseMoney(id, money) {
		try {
			const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
			const data = database[1].Users.find(user => user.id === id);
			if (!data) {
				return;
			}
			if (data && typeof data.money === 'number' && typeof money === 'number') {
				data.money -= money;
			}
			await fs.writeFileSync('./data/database.json', JSON.stringify(database, null, 2), 'utf-8');
			return data;
		} catch (error) {
			console.error('Error checking Currencies:', error);
		}
	},
	async getText(langText, ...args) {
    if (!langText.hasOwnProperty(args[0])) throw `${__filename} - Not found key language: ${args[0]}`;
    let text = langText[args[0]][args[1]];
    for (let i = args.length - 1; i > 1; i--) {
        const regEx = new RegExp(`%${i - 1}`, 'g');
        text = text.replace(regEx, args[i]);
    }
    return text;
},
	async getData(id) {
		try {
			const database = JSON.parse(fs.readFileSync('./data/database.json', 'utf8'));
			const data = database[1].Users.find(user => user.id === id);
			if (!data) {
				return;
			}
			return data;
		} catch (error) {
			console.error('Error checking Currencies:', error);
		}
	}
};
main() 
				      
