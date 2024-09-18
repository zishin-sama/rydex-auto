module.exports.config = {
  name: 'guessnum',
  version: '1.0',
  role: 0,
  description: 'A number guessing game',
  hasPrefix: true,
  aliases: ['gnum'],
  usage: 'guessnum',
  credits: 'Rydex',
  cooldown: 0
};

let minNum, maxNum, randomNumber, attemptsLeft;

module.exports.run = async function ({ api, args, event }) {
  function resetGame() {
    minNum = null;
    maxNum = null;
    randomNumber = null;
    attemptsLeft = null;
  }

  if (args[0] === 'start') {
    minNum = Math.floor(Math.random() * 100);
    maxNum = minNum + Math.floor(Math.random() * 50) + 50; 
    randomNumber = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    attemptsLeft = 5;

    return api.sendMessage(`🎲 Welcome to the Number Guessing Game! 🎲\nGuess the number between ${minNum} and ${maxNum}.\nYou have ${attemptsLeft} attempts. Good luck!`, event.threadID);
  }

  if (minNum == null || maxNum == null || randomNumber == null) {
    return api.sendMessage('You need to start the game first by typing `!guessnum start`.', event.threadID);
  }

  if (isNaN(args[0])) {
    return api.sendMessage('❌ Please enter a valid number as your guess.', event.threadID);
  }

  attemptsLeft--;
  const guess = parseInt(args[0]);

  if (guess === randomNumber) {
    api.sendMessage(messages.correct[0].replace('${5 - attemptsLeft}', `${5 - attemptsLeft}`), event.threadID);
    resetGame();
  } else if (attemptsLeft === 0) {
    api.sendMessage(messages.gameOver[0].replace('${randomNumber}', `${randomNumber}`), event.threadID);
    resetGame();
  } else {
    let feedback = '';
    if (Math.abs(guess - randomNumber) > 20) {
      feedback = messages.tooFar[Math.floor(Math.random() * messages.tooFar.length)];
    } else if (Math.abs(guess - randomNumber) <= 5) {
      feedback = messages.tooClose[Math.floor(Math.random() * messages.tooClose.length)];
    } else {
      feedback = messages.almost[Math.floor(Math.random() * messages.almost.length)];
    }

    api.sendMessage(`${feedback} You have ${attemptsLeft} attempts left.`, event.threadID);
  }
};
