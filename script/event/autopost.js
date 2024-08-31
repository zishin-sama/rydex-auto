const axios = require('axios');

const postInterval = 20 * 60 * 1000; 
const postTimes = [
  "06:00", "10:00", "12:00", "15:00", "17:00", "20:00", "22:00"
];

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
    api.sendMessage(`» Post created successfully\n» postID: ${postID}\n» urlPost: ${urlPost}`, threadID);
  } catch (error) {
    console.error("Error posting to Facebook:", error);
    api.sendMessage("Failed to create post. Please try again later.", threadID);
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

function getNextPostTime() {
  const now = new Date();
  const nowTime = now.getHours() * 100 + now.getMinutes();
  
  for (const time of postTimes) {
    const [hours, minutes] = time.split(":").map(Number);
    const postTime = hours * 100 + minutes;
    if (postTime > nowTime) {
      return new Date(now.getTime() + ((postTime - nowTime) * 60 * 1000));
    }
  }

  const [hours, minutes] = postTimes[0].split(":").map(Number);
  const nextPostTime = new Date();
  nextPostTime.setHours(hours, minutes, 0, 0);
  nextPostTime.setDate(nextPostTime.getDate() + 1);
  return nextPostTime;
}

async function startAutoPosting(api, threadID) {
  const quote = await fetchQuote();
  if (quote) {
    await postToFacebook(api, quote, threadID);
  }

  const nextPostTime = getNextPostTime();
  const now = new Date();
  const delay = nextPostTime - now;
  
  setTimeout(() => {
    startAutoPosting(api, threadID);
  }, Math.max(delay, postInterval));
}

module.exports.config = {
  name: "autoquotes",
  version: "1.1.0"
}

module.exports.handleEvent = async function({ api, event }) {
  startAutoPosting(api, event.threadID);
};
