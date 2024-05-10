const puppeteer = require('puppeteer');
const fs = require('fs');
const ADDRESS =
	'https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number';

const scrape = async () => {
	const browser = await puppeteer.launch({ headless: false });
	const page = await browser.newPage();
	page.setDefaultNavigationTimeout(60 * 1000);
	await page.goto(ADDRESS, {
		waitUntil: 'networkidle0',
	});
	const namesTextNoisy = await page.evaluate(() => {
		let result = '';
		const chunk = document.querySelectorAll('tbody td');
		for (let i = 1; i < chunk.length - 1; ++i) {
			let element = chunk[i];
			let image = element.querySelector('img');
			if (image) result += image.src + ',';
			let nextElement = chunk[i + 1];
			if (nextElement.textContent.startsWith('#')) {
				result += element.textContent.trim() + ',\n';
				continue;
			}
			if (element.textContent !== '')
				result += element.textContent.trim() + ',';
		}
		return result;
	});

	fs.writeFile('names_text_noisy.txt', namesTextNoisy, err => {
		console.log(err ? err : 'Text write succeed!');
	});

	await browser.close();
};

module.exports = scrape;
