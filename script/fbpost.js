const axios = require("axios");
const fs = require("fs-extra");

module.exports.config = {
    name: "fbpost",
    version: "1.0.0",
    role: 1,
    credits: "NTKhang",
    aliases: ["post"],
    description: "Create a new post in the bot's Facebook account",
    cooldown: 5
};

module.exports.run = async ({ event, api }) => {
    const { threadID, messageID, senderID, body } = event;
    const [audience, ...messageParts] = body.split(" ");
    const messageText = messageParts.join(" ");
    let audienceType = "";

    // Map audience keywords to privacy settings
    if (audience.toLowerCase() === "public") audienceType = "EVERYONE";
    else if (audience.toLowerCase() === "friends") audienceType = "FRIENDS";
    else if (audience.toLowerCase() === "self") audienceType = "SELF";
    else {
        return api.sendMessage("Invalid audience type. Use 'public', 'friends', or 'self'.", threadID, messageID);
    }

    const uuid = getGUID();
    const formData = {
        input: {
            composer_entry_point: "inline_composer",
            composer_source_surface: "timeline",
            idempotence_token: uuid + "_FEED",
            source: "WWW",
            attachments: [],
            audience: {
                privacy: {
                    allow: [],
                    base_state: audienceType,
                    deny: [],
                    tag_expansion_state: "UNSPECIFIED"
                }
            },
            message: {
                ranges: [],
                text: messageText
            },
            with_tags_ids: [],
            inline_activities: [],
            explicit_place_id: "0",
            text_format_preset_id: "0",
            logging: {
                composer_session_id: uuid
            },
            tracking: [null],
            actor_id: api.getCurrentUserID(),
            client_mutation_id: Math.floor(Math.random() * 17)
        },
        displayCommentsFeedbackContext: null,
        displayCommentsContextEnableComment: null,
        displayCommentsContextIsAdPreview: null,
        displayCommentsContextIsAggregatedShare: null,
        displayCommentsContextIsStorySet: null,
        feedLocation: "TIMELINE",
        feedbackSource: 0,
        focusCommentID: null,
        gridMediaWidth: 230,
        groupID: null,
        scale: 3,
        privacySelectorRenderLocation: "COMET_STREAM",
        renderLocation: "timeline",
        useDefaultActor: false,
        inviteShortLinkKey: null,
        isFeed: false,
        isFundraiser: false,
        isFunFactPost: false,
        isGroup: false,
        isTimeline: true,
        isSocialLearning: false,
        isPageNewsFeed: false,
        isProfileReviews: false,
        isWorkSharedDraft: false,
        UFI2CommentsProvider_commentsKey: "ProfileCometTimelineRoute",
        hashtag: null,
        canUserManageOffers: false
    };

    // Check if the command includes attachments
    if (event.type === "message_reply" && event.attachments.length > 0) {
        let attachments = [];
        for (const attachment of event.attachments) {
            const filePath = __dirname + `/cache/${attachment.filename}`;
            const response = await axios.get(attachment.url, { responseType: "arraybuffer" });
            fs.writeFileSync(filePath, Buffer.from(response.data));
            attachments.push(fs.createReadStream(filePath));
        }
        await processAttachments(api, attachments, formData, threadID, messageID);
    } else {
        // If no attachments, proceed with posting text only
        postToFacebook(api, formData, threadID, messageID);
    }
};

async function processAttachments(api, attachments, formData, threadID, messageID) {
    const uploads = attachments.map(attachment => {
        return api.httpPostFormData(`https://www.facebook.com/profile/picture/upload/?profile_id=${api.getCurrentUserID()}&photo_source=57&av=${api.getCurrentUserID()}`, { file: attachment });
    });

    const results = await Promise.all(uploads);
    for (let result of results) {
        if (typeof result === "string") result = JSON.parse(result.replace("for (;;);", ""));
        formData.input.attachments.push({
            "photo": {
                "id": result.payload.fbid.toString(),
            }
        });
    }

    postToFacebook(api, formData, threadID, messageID);
}

function postToFacebook(api, formData, threadID, messageID) {
    const form = {
        av: api.getCurrentUserID(),
        fb_api_req_friendly_name: "ComposerStoryCreateMutation",
        fb_api_caller_class: "RelayModern",
        doc_id: "7711610262190099",
        variables: JSON.stringify(formData)
    };

    api.httpPost('https://www.facebook.com/api/graphql/', form, (err, res) => {
        if (err) {
            return api.sendMessage("Failed to create post. Please try again.", threadID, messageID);
        }
        const response = JSON.parse(res);
        if (response.errors) {
            return api.sendMessage("Error creating post.", threadID, messageID);
        }
        const postID = response.data.story_create.story.legacy_story_hideable_id;
        const urlPost = response.data.story_create.story.url;
        api.sendMessage(`Post created successfully: ${urlPost}`, threadID, messageID);
    });
}

function getGUID() {
    var sectionLength = Date.now();
    var id = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        var r = Math.floor((sectionLength + Math.random() * 16) % 16);
        sectionLength = Math.floor(sectionLength / 16);
        var _guid = (c == "x" ? r : (r & 7) | 8).toString(16);
        return _guid;
    });
    return id;
}
