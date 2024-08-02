const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

module.exports.config = {
  name: "accept",
  version: "1.0.0",
  role: 1,
  credits: "BLACK",
  description: "Make friends via Facebook ID",
  aliases: [],
  hasPrefix: true,
  usage: "uid",
  cooldown: 0
};

module.exports.handleEvent = async ({ event, api }) => {
  if (event.type !== "message_reply") return;

  const { author, listRequest } = event;
  if (author !== event.senderID) return;

  const args = event.body.replace(/ +/g, " ").toLowerCase().split(" ");
  const command = args[0];
  const action = args[1];
  let targetIDs = args.slice(2);
  
  if (!["add", "del"].includes(command)) {
    return api.sendMessage("Please select <add | del> <end | order or \"all\">", event.threadID, event.messageID);
  }
  
  if (action === "all") {
    targetIDs = listRequest.map((_, index) => index + 1);
  }

  const form = {
    av: api.getCurrentUserID(),
    fb_api_caller_class: "RelayModern",
    variables: {
      input: {
        source: "friends_tab",
        actor_id: api.getCurrentUserID(),
        client_mutation_id: Math.round(Math.random() * 19).toString()
      },
      scale: 3,
      refresh_num: 0
    }
  };

  if (command === "add") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
    form.doc_id = "3147613905362928";
  } else if (command === "del") {
    form.fb_api_req_friendly_name = "FriendingCometFriendRequestDeleteMutation";
    form.doc_id = "4108254489275063";
  }

  const success = [];
  const failed = [];
  const promiseFriends = [];

  for (const stt of targetIDs) {
    const u = listRequest[parseInt(stt) - 1];
    if (!u) {
      failed.push(`Stt ${stt} was not found in the list`);
      continue;
    }
    form.variables.input.friend_requester_id = u.node.id;
    form.variables = JSON.stringify(form.variables);
    promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", form));
    form.variables = JSON.parse(form.variables);
  }

  for (let i = 0; i < promiseFriends.length; i++) {
    try {
      const response = await promiseFriends[i];
      const result = JSON.parse(response);
      if (result.errors) {
        failed.push(listRequest[parseInt(targetIDs[i]) - 1].node.name);
      } else {
        success.push(listRequest[parseInt(targetIDs[i]) - 1].node.name);
      }
    } catch (e) {
      failed.push(listRequest[parseInt(targetIDs[i]) - 1].node.name);
    }
  }

  api.sendMessage(`» ${command === 'add' ? 'Accepted' : 'Deleted'} ${success.length} friend requests:\n${success.join("\n")}${failed.length > 0 ? `\n» Failed with ${failed.length} requests:\n${failed.join("\n")}` : ""}`, event.threadID, event.messageID);
};

module.exports.run = async ({ event, api }) => {
  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
    fb_api_caller_class: "RelayModern",
    doc_id: "4499164963466303",
    variables: JSON.stringify({ input: { scale: 3 } })
  };

  try {
    const response = await api.httpPost("https://www.facebook.com/api/graphql/", form);
    const listRequest = JSON.parse(response).data.viewer.friending_possibilities.edges;

    let msg = "";
    listRequest.forEach((user, i) => {
      msg += (`\n${i + 1}. 𝐍𝐚𝐦𝐞: ${user.node.name}`
           + `\n𝐈𝐃: ${user.node.id}`
           + `\n𝐔𝐫𝐥: ${user.node.url.replace("www.facebook", "fb")}`
           + `\n𝐓𝐢𝐦𝐞: ${moment(user.time * 1000).tz("Asia/Manila").format("DD/MM/YYYY HH:mm:ss")}\n`);
    });

    api.sendMessage(`${msg}\nReply to this message with: <add | del> <the order of | or "all"> to take action`, event.threadID, (e, info) => {
      global.client.handleReply.push({
        name: this.config.name,
        messageID: info.messageID,
        listRequest,
        author: event.senderID
      });
    }, event.messageID);
  } catch (error) {
    console.error("Error fetching friend requests:", error);
  }
};
