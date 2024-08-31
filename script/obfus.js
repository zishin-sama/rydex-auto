module.exports.config = {
	name: "obfuscate",
	version: "1.0.0",
	role: 0,
	credits: "cliff", 
	description: "Obfuscate JavaScript code",
	aliases: ["obfus"],
	cooldown: 0,
	hasPrefix: true,
	usage: "obfuscate",
};

const JavaScriptObfuscator = require('javascript-obfuscator');

module.exports.run = async function ({ api, event, args }) {
	const obfuscationResult = JavaScriptObfuscator.obfuscate(
		args.join(" "),
		{
			compact: true,
			controlFlowFlattening: true,
			controlFlowFlatteningThreshold: 1,
			deadCodeInjection: false,
			deadCodeInjectionThreshold: 0.4,
			debugProtection: false,
			debugProtectionInterval: 0,
			disableConsoleOutput: false,
			domainLock: [],
			domainLockRedirectUrl: 'about:blank',
			forceTransformStrings: [],
			identifierNamesCache: null,
			identifierNamesGenerator: 'hexadecimal',
			identifiersDictionary: [],
			identifiersPrefix: 'Rydex',
			ignoreImports: false,
			inputFileName: '',
			log: false,
			numbersToExpressions: true,
			optionsPreset: 'default',
			renameGlobals: true,
			renameProperties: true,
			renamePropertiesMode: 'safe',
			reservedNames: [],
			reservedStrings: [],
			seed: 0,
			selfDefending: false,
			simplify: true,
			sourceMap: false,
			sourceMapBaseUrl: '',
			sourceMapFileName: '',
			sourceMapMode: 'separate',
			sourceMapSourcesMode: 'sources-content',
			splitStrings: true,
			splitStringsChunkLength: 10,
			stringArray: true,
			stringArrayCallsTransform: true,
			stringArrayCallsTransformThreshold: 0.5,
			stringArrayEncoding: [],
			stringArrayIndexesType: ['hexadecimal-number'],
			stringArrayIndexShift: true,
			stringArrayRotate: true,
			stringArrayShuffle: true,
			stringArrayWrappersCount: 1,
			stringArrayWrappersChainedCalls: true,
			stringArrayWrappersParametersMaxCount: 2,
			stringArrayWrappersType: 'variable',
			stringArrayThreshold: 1,
			target: 'browser',
			transformObjectKeys: true,
			unicodeEscapeSequence: false
		}
	);

	api.sendMessage(obfuscationResult.getObfuscatedCode(), event.threadID);
};