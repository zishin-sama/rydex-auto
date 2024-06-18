module.exports.config = {
  name: "tictactoe",
  credits: "Aze Kagenou",
  description: "Play a game of tic-tac-toe",
  hasPrefix: false,
  usage: "kayo na umintindi",
  aliases: [],
  cooldown: 0,
  role: 0,
};


module.exports.run = async function({ api, event }) {
    let boardSize = 3;
    let winCondition = 3;
    let players = [];
    let currentPlayer = 0;
    let gameOver = false;
    let pause = false;
    let gameInProgress = false;
    let difficulty = 'easy';

    function initializeBoard(size) {
      return Array(size * size).fill(null);
    }

    let board = initializeBoard(boardSize);

    function sendBoard() {
      if (gameOver) return;
      let message = '';
      for (let i = 0; i < board.length; i++) {
        message += board[i] || '_';
        if ((i + 1) % boardSize === 0) {
          message += '\n';
        } else {
          message += ' ';
        }
      }
      api.sendMessage(message, event.threadID, event.messageID);
    }

    function handleMove(index) {
      if (gameOver || pause || board[index] !== null) {
        api.sendMessage("Invalid move! Please try again.", event.threadID, event.messageID);
        return;
      }
      board[index] = players[currentPlayer].symbol;
      if (checkWin(players[currentPlayer].symbol)) {
        gameOver = true;
        api.sendMessage(`${players[currentPlayer].name} wins!`, event.threadID, event.messageID);
      } else if (board.every(cell => cell !== null)) {
        gameOver = true;
        api.sendMessage("It's a draw!", event.threadID, event.messageID);
      } else {
        currentPlayer = (currentPlayer + 1) % players.length;
        sendBoard();
        api.sendMessage(`Your turn, ${players[currentPlayer].name}`, event.threadID, event.messageID);
        if (players[currentPlayer].id === "bot") {
          botMove();
        }
      }
    }

    function checkWin(symbol) {
      const winConditions = generateWinConditions(boardSize, winCondition);
      return winConditions.some(condition => condition.every(index => board[index] === symbol));
    }

    function generateWinConditions(size, win) {
      const winConditions = [];
      for (let i = 0; i < size; i++) {
        let row = [], col = [];
        for (let j = 0; j < size; j++) {
          row.push(i * size + j);
          col.push(j * size + i);
        }
        winConditions.push(row);
        winConditions.push(col);
      }
      let diag1 = [], diag2 = [];
      for (let i = 0; i < size; i++) {
        diag1.push(i * size + i);
        diag2.push(i * size + (size - i - 1));
      }
      winConditions.push(diag1);
      winConditions.push(diag2);
      return winConditions.filter(condition => condition.length >= win);
    }

    function botMove() {
      let move;
      if (difficulty === 'easy') {
        move = randomMove();
      } else if (difficulty === 'medium') {
        move = Math.random() < 0.5 ? minimaxMove('O') : randomMove();
      } else if (difficulty === 'hard') {
        move = minimaxMove('O');
      }
      handleMove(move);
    }

    function randomMove() {
      const availableMoves = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    function minimaxMove(symbol) {
      const opponent = symbol === 'X' ? 'O' : 'X';

      function minimax(board, depth, isMaximizing) {
        if (checkWin('O')) return { score: 10 - depth };
        if (checkWin('X')) return { score: depth - 10 };
        if (board.every(cell => cell !== null)) return { score: 0 };

        const availableMoves = board.map((v, i) => v === null ? i : null).filter(v => v !== null);
        let bestMove;
        if (isMaximizing) {
          let maxEval = -Infinity;
          for (let move of availableMoves) {
            board[move] = symbol;
            const evaluation = minimax(board, depth + 1, false);
            board[move] = null;
            if (evaluation.score > maxEval) {
              maxEval = evaluation.score;
              bestMove = move;
            }
          }
          return { score: maxEval, move: bestMove };
        } else {
          let minEval = Infinity;
          for (let move of availableMoves) {
            board[move] = opponent;
            const evaluation = minimax(board, depth + 1, true);
            board[move] = null;
            if (evaluation.score < minEval) {
              minEval = evaluation.score;
              bestMove = move;
            }
          }
          return { score: minEval, move: bestMove };
        }
      }
      return minimax(board, 0, true).move;
    }

    function extractMentionedUsers(event) {
      const mentions = event.mentions || {};
      return Object.keys(mentions).map(id => ({
        id,
        name: mentions[id].replace('@', ''),
      }));
    }

    try {
      const [, cmd, arg] = event.body.toLowerCase().match(/^tictactoe\s*(.*)$/) || [];
      
      if (cmd === "start") {
        if (gameInProgress) {
          throw new Error("A game of tictactoe is already in progress.");
        }
        gameInProgress = true;
        players = [
          { id: event.senderID, name: "Player 1", symbol: "X" },
          { id: "bot", name: "Bot", symbol: "O" }
        ];
        sendBoard();
        api.sendMessage("Game started! Player 1, your turn.", event.threadID, event.messageID);

      } else if (cmd.startsWith("start ")) {
        const params = cmd.split(" ")[1].split("|");
        boardSize = parseInt(params[0]) || 3;
        winCondition = parseInt(params[1]) || boardSize;
        difficulty = params[2] || 'easy';
        
        const mentionedUsers = extractMentionedUsers(event);
        players = [
          { id: event.senderID, name: "Player 1", symbol: params[3] || "X" }
        ];

        for (let i = 0; i < mentionedUsers.length; i++) {
          players.push({ id: mentionedUsers[i].id, name: mentionedUsers[i].name, symbol: params[4 + i] || (i % 2 === 0 ? "O" : "X") });
        }

        board = initializeBoard(boardSize);
        gameInProgress = true;
        sendBoard();
        api.sendMessage(`Game started with ${players.length} players! ${players[0].name}, your turn.`, event.threadID, event.messageID);

      } else if (cmd === "pause") {
        if (!gameOver) {
          pause = true;
          api.sendMessage("Game paused.", event.threadID, event.messageID);
        } else {
          throw new Error("Game is already over.");
        }
      } else if (cmd === "resume") {
        if (!gameOver) {
          pause = false;
          api.sendMessage("Game resumed.", event.threadID, event.messageID);
        } else {
          api.sendMessage("Game is already over.", event.threadID, event.messageID);
        }
      } else if (cmd === "reset") {
        gameOver = false;
        gameInProgress = false;
        board = initializeBoard(boardSize);
        players = [];
        api.sendMessage("Game has been reset.", event.threadID, event.messageID);
      } else {
        const match = event.body.match(/tictactoe\s*(move\s+)?(\d+)/i);
        if (match) {
          const moveInput = match[2];
          if (isNaN(moveInput)) {
            api.sendMessage("Invalid move. Please enter a valid number.", event.threadID, event.messageID);
            return;
          }
          const index = parseInt(moveInput) - 1;
          if (index >= 0 && index < board.length) {
            if (players[currentPlayer].id === event.senderID) {
              handleMove(index);
            } else {
              api.sendMessage("It's not your turn.", event.threadID, event.messageID);
            }
          } else {
            api.sendMessage("Invalid move. Please enter a number between 1 and " + board.length, event.threadID, event.messageID);
          }
        } else {
          api.sendMessage("Command not recognized. Use 'tictactoe start' to start a game, 'tictactoe pause' to pause the game, 'tictictactoe resume' to resume the game, or 'tictactoe reset' to reset the game.", event.threadID, event.messageID);
        }
      }
    } catch (error) {
      api.sendMessage(error.message, event.threadID, event.messageID);
    }
  };

