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

module.exports.run = async function ({api, args, event}) {
  if (args[0] === 'start') {
    minNum = Math.floor(Math.random() * 100);
    maxNum = minNum + Math.floor(Math.random() * 100);
    randomNumber = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
    attemptsLeft = 5; // Set the number of attempts available to the user
    
    api.sendMessage(`Guess the number range from ${minNum} to ${maxNum}. You have ${attemptsLeft} attempts.`, event.threadID);
  } else if (isNaN(args[0])) {
    api.sendMessage('Please input a valid number as your guess.', event.threadID);
  } else {
    attemptsLeft--;
    
    if (parseInt(args[0]) === randomNumber) {
      api.sendMessage(`Congratulations! You guessed the correct number in ${5 - attemptsLeft} attempts`, event.threadID);
      minNum = null;
      maxNum = null;
      randomNumber = null;
    } else if (attemptsLeft === 0) {
      api.sendMessage(`Sorry, you have run out of attempts. The correct number was ${randomNumber}.`, event.threadID);
      minNum = null;
      maxNum = null;
      randomNumber = null;
    } else if (Math.abs(parseInt(args[0]) - randomNumber) > 10) {
      api.sendMessage(`Your guess is too far. You have ${attemptsLeft} attempts left. Try again.`, event.threadID);
    } else {
      api.sendMessage(`You are almost correct. You have ${attemptsLeft} attempts left. Keep guessing!`, event.threadID);
    }
  }
};