import { translate } from '@vitalets/google-translate-api';
import enJSON from '../../dashboard/src/translations/en.json';
import * as fs from 'node:fs';
import { HttpProxyAgent } from 'http-proxy-agent';

// function sleep(ms:number) {
//
// 	return new Promise((resolve) => setTimeout(resolve, ms));
// }

const run = async () => {
	const targetLang = 'pt';
	const sourceJSON = enJSON.translation as { [key: string]: string };
	const translated: { translation: { [key: string]: string } } = {
		translation: {},
	};

	//https://free-proxy-list.net/
	const agent = new HttpProxyAgent('http://95.217.178.175:80');

	console.log('[DEBUG]:',`translating to ${targetLang}...`);
	for (const key of Object.keys(sourceJSON)) {
		const { text } = await translate(sourceJSON[key], {
			to: targetLang,
			fetchOptions: { agent },
		});

		translated.translation[key] = text;
	}
	console.log('[DEBUG]:','building JSON...');
	// Convert object to JSON string
	const jsonString = JSON.stringify(translated, null, 4);
	console.log('[DEBUG]:','Done!');

	fs.writeFileSync(`output/${targetLang}.json`, jsonString, 'utf8');
};

run();
