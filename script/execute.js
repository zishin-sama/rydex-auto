const safeExecute = (code) => {
  try {
    const func = new Function(code);
    let result = func();

    if (typeof result === 'object') {
      result = JSON.stringify(result);
    }

    return result;
  } catch (error) {
    if (error instanceof SyntaxError) {
      return "Syntax Error: Unable to execute the provided code";
    } else if (error instanceof TypeError) {
      return "Type Error: Check for any data type mismatches";
    } else {
      return `${error.name}: ${error.message}`;
    }
  }
};

module.exports.config = {
  name: 'execute',
  version: 'beta',
  role: 1,
  description: 'execute code',
  usage: '',
  aliases: [],
  credits: '',
  hasPrefix: true,
  cooldown: 0
};

module.exports.run = async function ({ api, args, event }) {
  const code = args.join(' ');
  const result = safeExecute(code);
  api.sendMessage(result, event.threadID);
};