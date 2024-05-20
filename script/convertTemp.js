module.exports.config = {
    name: 'convertTemp',
    version: '1.0.0',
    hasPermision: 0,
    credits: 'chilli',
    usePrefix: true,
    description: 'Convert temperatures between Celsius and Fahrenheit',
    commandCategory: 'utilities',
    usages: '<temperature><C/F>',
    cooldowns: 5
};

module.exports.run = ({ event, args }) => {
    const input = args.join(' ').trim();
    
    if (!input) {
        return api.sendMessage("Please provide a temperature and unit (e.g., 100C or 212F).", event.threadID, event.messageID);
    }

    const temp = parseFloat(input.slice(0, -1));
    const unit = input.slice(-1).toUpperCase();

    if (isNaN(temp) || (unit !== 'C' && unit !== 'F')) {
        return api.sendMessage("Invalid input. Please provide a valid temperature and unit (e.g., 100C or 212F).", event.threadID, event.messageID);
    }

    let convertedTemp;
    let result;

    if (unit === 'C') {
        convertedTemp = (temp * 9/5) + 32;
        result = `${temp}°C is equal to ${convertedTemp.toFixed(2)}°F.`;
    } else if (unit === 'F') {
        convertedTemp = (temp - 32) * 5/9;
        result = `${temp}°F is equal to ${convertedTemp.toFixed(2)}°C.`;
    }

    api.sendMessage(result, event.threadID, event.messageID);
};
