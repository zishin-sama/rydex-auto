const axios = require('axios');
const fs = require('fs');
const moment = require('moment-timezone');

const POST_INTERVAL = 5 * 60 * 1000; // 5 minutes in milliseconds
const LAST_POST_FILE = 'last_post_time.json'; // File to store last post time

async function fetchQuote() {
  const api_url = "https://zenquotes.io/api/quotes/";
  try {
    const response = await axios.get(api_url);
    const data = response.data;
    if (data && data.length > 0) {
      const quote = data[0].q;
      const author = data[0].a;
      return `${quote}\n\n-${author}`;
    }
  } catch (error) {
    console.error("Error fetching quote:", error);
    return null;
  }
}

async function postToFacebook(api, message, threadID) {
  const formData = {
    input: {
      composer_entry_point: "inline_composer",
      composer_source_surface: "timeline",
      idempotence_token: getGUID() + "_FEED",
      source: "WWW",
      attachments: [],
      audience: {
        privacy: {
          allow: [],
          base_state: "FRIENDS",
          deny: [],
          tag_expansion_state: "UNSPECIFIED"
        }
      },
      message: { text: message },
      with_tags_ids: [],
      inline_activities: [],
      explicit_place_id: "0",
      text_format_preset_id: "0",
      logging: { composer_session_id: getGUID() },
      tracking: [null],
      actor_id: api.getCurrentUserID(),
      client_mutation_id: Math.floor(Math.random() * 17)
    },
    displayCommentsFeedbackContext: null,
    displayCommentsContextEnableComment: null,
    displayCommentsContextIsAdPreview: null,
    displayCommentsContextIsAggregatedShare: null,
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

  const form = {
    av: api.getCurrentUserID(),
    fb_api_req_friendly_name: "ComposerStoryCreateMutation",
    fb_api_caller_class: "RelayModern",
    doc_id: "7711610262190099",
    variables: JSON.stringify(formData)
  };

  try {
    const response = await api.httpPost('https://www.facebook.com/api/graphql/', form);
    const data = JSON.parse(response.replace("for (;;);", ""));
    if (data.errors) throw data.errors;
    const postID = data.data.story_create.story.legacy_story_hideable_id;
    const urlPost = data.data.story_create.story.url;
  } catch (error) {
    console.error("Error posting to Facebook:", error);
  }
}

function getGUID() {
  let sectionLength = Date.now();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = Math.floor((sectionLength + Math.random() * 16) % 16);
    sectionLength = Math.floor(sectionLength / 16);
    return (c == "x" ? r : (r & 7) | 8).toString(16);
  });
}

function readLastPostTime() {
  if (fs.existsSync(LAST_POST_FILE)) {
    const data = fs.readFileSync(LAST_POST_FILE, 'utf-8');
    return new Date(JSON.parse(data).lastPostTime);
  }
  return null;
}

function writeLastPostTime(date) {
  fs.writeFileSync(LAST_POST_FILE, JSON.stringify({ lastPostTime: date }));
}

async function startAutoPosting(api, threadID) {
  let lastPostTime = readLastPostTime();
  if (!lastPostTime) {
    lastPostTime = new Date();
  }

  while (true) {
    const now = new Date();
    const timeSinceLastPost = now - lastPostTime;

    if (timeSinceLastPost >= POST_INTERVAL) {
      const quote = await fetchQuote();
      if (quote) {
        await postToFacebook(api, quote, threadID);
        lastPostTime = new Date();
        writeLastPostTime(lastPostTime);
      }
    }

    const timeUntilNextPost = POST_INTERVAL - (now - lastPostTime);
    await new Promise(resolve => setTimeout(resolve, timeUntilNextPost));
  }
}

module.exports.config = {
  name: "autoquotes",
  version: "1.1.0"
};

module.exports.handleEvent = async function({ api, event }) {
  startAutoPosting(api, event.threadID);
};
