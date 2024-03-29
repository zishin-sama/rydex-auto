const Exponents = require('advanced-calculator');
const Volume = require('advanced-calculator');

module.exports.config = {
	name: "adcal",
	version: "3.5",
	credits: "Jonell Magallanes",
	hasPrefix: false,
	role: 0,
	description: "adcal",
	usage: "advance <operation> <values>",
	cooldowns: 5,
	aliases: []
};

module.exports.run = async function({ api, event, args }) {
		let result;
		const operation = args[0];
		args.shift(); 

		try {
			switch (operation) {
				// Exponents operations
				case 'multiplyExponents':
					result = Exponents.multiplyExponents(args);
					break;
				case 'divideExponents':
					result = Exponents.divideExponents(args);
					break;
				case 'negativeExponents':
					result = Exponents.negativeExponents(args[0], args[1]);
					break;
				case 'fractionalExponents':
					result = Exponents.fractionalExponents(args[0], args[1], args[2]);
					break;
				case 'powerOfPower':
					result = Exponents.powerOfPower(args[0], args[1], args[2]);
					break;
				case 'x10':
					result = Exponents.x10(args[0], args[1]);
					break;

				// Volume operations
				case 'sphereSurfaceArea':
					result = Volume.sphereSurfaceArea(args[0]);
					break;
				case 'sphereVolume':
					result = Volume.sphereVolume(args[0]);
					break;
				case 'cubeSurfaceArea':
					result = Volume.cubeSurfaceArea(args[0]);
					break;
				case 'cubeVolume':
					result = Volume.cubeVolume(args[0]);
					break;
				case 'rectangularprizmSurfaceArea':
					result = Volume.rectangularprizmSurfaceArea(args[0], args[1], args[2]);
					break;
				case 'rectangularprizmVolume':
					result = Volume.rectangularprizmVolume(args[0], args[1], args[2]);
					break;
				case 'cylinderSurfaceArea':
					result = Volume.cylinderSurfaceArea(args[0], args[1]);
					break;
				case 'cylinderVolume':
					result = Volume.cylinderVolume(args[0], args[1]);
					break;
				case 'coneSurfaceArea':
					result = Volume.coneSurfaceArea(args[0], args[1], args[2]);
					break;
				case 'coneVolume':
					result = Volume.coneVolume(args[0], args[1]);
					break;

				default:
					api.sendMessage("Unknown operation.", event.threadID);
					return;
			}
			api.sendMessage(`Result: ${result}`, event.threadID);
		} catch (error) {
			api.sendMessage(`Error: ${error.message}`, event.threadID);
		}
};
