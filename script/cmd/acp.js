const moment = require('moment-timezone');

module.exports.config = {
  name: "accept",
  version: "1.0.0",
  role: 1,
  credits: "BLACK",
  description: "Accept a friend request via Facebook ID",
  aliases: [],
  hasPrefix: true,
  usage: "accept <ID>",
  cooldown: 0
};

module.exports.run = async ({ event, api, args }) => {
  const id = args[0];
  
  if (!id) {
    return api.sendMessage("Please provide a valid ID.", event.threadID, event.messageID);
  }

  // Fetch the friend requests
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

    const user = listRequest.find(u => u.node.id === id);
    if (!user) {
      return api.sendMessage("ID not found in friend requests or the user has not sent a friend request.", event.threadID, event.messageID);
    }

    const acceptForm = {
      av: api.getCurrentUserID(),
      fb_api_caller_class: "RelayModern",
      variables: {
        input: {
          source: "friends_tab",
          actor_id: api.getCurrentUserID(),
          client_mutation_id: Math.round(Math.random() * 19).toString(),
          friend_requester_id: user.node.id
        },
        scale: 3,
        refresh_num: 0
      },
      fb_api_req_friendly_name: "FriendingCometFriendRequestConfirmMutation",
      doc_id: "3147613905362928"
    };

    const acceptResponse = await api.httpPost("https://www.facebook.com/api/graphql/", acceptForm);
    const result = JSON.parse(acceptResponse);
    if (result.errors) {
      api.sendMessage("Failed to accept friend request.", event.threadID, event.messageID);
    } else {
      api.sendMessage(`Accepted friend request from ${user.node.name}.`, event.threadID, event.messageID);
    }
  } catch (error) {
    console.error("Error processing request:", error);
    api.sendMessage("An error occurred while processing the request.", event.threadID, event.messageID);
  }
};
