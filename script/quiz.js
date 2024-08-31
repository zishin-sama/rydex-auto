module.exports.config = {
  name: "quiz",
  version: "1.0",
  role: 0, 
  credits: "Aki Hayakawa",
  aliases: [],
  usage: "quiz [difficulty] [category]/ quiz help", 
  hasPrefix: true, 
  description: "Answer trivia questions", 
  cooldown: 5,
};

const axios = require('axios');
const triviaData = {};

const difficultyMap = {
  easy: 'easy',
  medium: 'medium',
  hard: 'hard',
};

const categoryMap = {
  general: 9,
  books: 10,
  film: 11,
  music: 12,
  theatres: 13,
  television: 14,
  videogames: 15,
  boardgames: 16,
  science: 17,
  computers: 18,
  math: 19,
  mythology: 20,
  sports: 21,
  geography: 22,
  history: 23,
  politics: 24,
  art: 25,
  celebrity: 26,
  animals: 27,
  vehicles: 28,
  comics: 29,
  gadgets: 30,
  anime: 31,
  cartoon: 32,
};

async function getUserName(api, senderID) {
  const userInfo = await api.getUserInfo(senderID);
  const user = userInfo[senderID];
  if (user && user.name) {
    return user.name;
  } else {
    return "Unknown User";
  }
}

function revealAnswer(api, threadID) {
  if (!triviaData[threadID].answered) {
    const { correctIndex, options } = triviaData[threadID];
    const correctLetter = String.fromCharCode(65 + correctIndex);
    api.sendMessage(`Time's up! The correct answer is:\n\n${correctLetter}. ${decodeURIComponent(options[correctIndex])}`, threadID);
    triviaData[threadID].answered = true;
  }
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;

  if (triviaData[threadID]) {
    delete triviaData[threadID];
  }

  try {
    const [difficultyInput, categoryInput] = args.map(arg => arg.toLowerCase());
    const difficulty = difficultyMap[difficultyInput] || '';
    const category = categoryMap[categoryInput] || ''; 

    if (args[0] === 'help'){
      return api.sendMessage(`Kazeu Quiz\n\nDifficulties:\n\neasy\nmedium\nhard\n\nCategories:\n\ngeneral\nbooks\nfilm\nmusic\ntheatres\ntelevision\nvideogames\nboardgames\nscience\ncomputers\nmath\nmythology\nsports\ngeography\nhistory\npolitics\nart\ncelebrity\nanimals\nvehicles\ncomics\ngadgets\nanime\ncartoon\n\nUsage:\nquiz [difficulty] [category]\n\nExample:\nquiz medium math`, threadID, messageID);
    }

    const response = await axios.get(`https://opentdb.com/api.php?amount=1&type=multiple&encode=url3986&difficulty=${difficulty}&category=${category}`);
    const question = response.data.results[0];

    const displayCategory = question.category;
    const displayDifficulty = question.difficulty;

    const options = [question.correct_answer, ...question.incorrect_answers].sort(() => Math.random() - 0.5);
    const optionsString = options.map((option, index) => `${String.fromCharCode(65 + index)}. ${option}`).join('\n');

    const questionMessage = `Difficulty: ${capitalizeFirstLetter(decodeURIComponent(displayDifficulty))}\nCategory: ${decodeURIComponent(displayCategory)}\n\n${decodeURIComponent(question.question)}\n\n${decodeURIComponent(optionsString)}`;
    api.sendMessage(questionMessage, threadID);

    triviaData[threadID] = {
      correctIndex: options.indexOf(question.correct_answer),
      answered: false,
      options: options,
    };

    const timeout = setTimeout(() => {
      revealAnswer(api, threadID);
    }, 30000);

    triviaData[threadID].timeout = timeout;

    api.listenMqtt((_, message) => {
      if (message.body && /^[a-d]$/.test(message.body.toLowerCase()) && !triviaData[threadID].answered) {
        const userAnswer = message.body.toLowerCase();
        const { correctIndex, options } = triviaData[threadID];

        const correctLetter = String.fromCharCode(65 + correctIndex).toLowerCase(); 

        if (userAnswer === correctLetter) {
          clearTimeout(triviaData[threadID].timeout);

          getUserName(api, message.senderID)
            .then(senderName => {
              api.sendMessage({
                body: `${senderName} you are correct! The answer is:\n\n${userAnswer.toUpperCase()}. ${decodeURIComponent(options[correctIndex])}`
              }, threadID, message.messageID);
            })
            .catch(error => {
              console.error("Error fetching user's name:", error);
            });
        } else {
          clearTimeout(triviaData[threadID].timeout);

          getUserName(api, message.senderID)
            .then(senderName => {
              api.sendMessage({
                body: `Sorry, ${senderName}! Your answer is wrong. The correct answer is:\n\n${String.fromCharCode(65 + correctIndex)}. ${decodeURIComponent(options[correctIndex])}`
              }, threadID, message.messageID);
            })
            .catch(error => {
              console.error("Error fetching user's name:", error);
            });
        }

        triviaData[threadID].answered = true;
      }
    });
    
  } catch (error) {
    console.error("Error fetching trivia question:", error);
    api.sendMessage("An error occurred while fetching the trivia question.", threadID);
  }
};