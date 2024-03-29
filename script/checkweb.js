this.config = {
		name: 'check',
		version: '0.0.1',
		role: 0,
		credits: 'clifff',
		description: '',
		hasPrefix: false,
		usage: '.checkweb [domain]',
		cooldowns: 3
};

let axios = require('axios');
let cheerio = require('cheerio');

this.run = function (o) {
		let send = msg => o.api.sendMessage(msg, o.event.threadID, o.event.messageID);

		axios.get('https://scam.vn/check-website?domain=' + encodeURIComponent(o.args[0])).then(res => {
				let dom = cheerio.load(res.data);
				let div = dom('.container.text-center');
				let date_register = div.find('div:eq(0) > div').eq(0).find('h6').text().split(' ').pop();
				let [like, dis_like] = ['#improve_web', '#report_web'].map($ => div.find($ + ' > span').text());
				let do_tin_cay = div.find('.col-md-12.bg-warning.p-3 > a').text();
				let warn = [0, 1].map($ => div.find('.col-md-6.mt-2').eq($).text().trim());

				send(`[===[ Check Scam ]===]\n\n- Domain: ${o.args[0]}\n- Register: ${date_register}\n- Evaluate:\n 👍: ${like}\n 👎: ${dis_like}\n- Trust: ${do_tin_cay}\n- Evaluation:\n\n${warn.join('\n\n')}`);
		}).catch(err => send(err.toString()));
};
