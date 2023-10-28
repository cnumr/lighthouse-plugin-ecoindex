import puppeteer from 'puppeteer';
import {startFlow} from 'lighthouse';
import {writeFileSync} from 'fs';

const browser = await puppeteer.launch();
const page = await browser.newPage();
const flow = await startFlow(page);

// Navigate with a URL
await flow.navigate('https://example.com');

// Interaction-initiated navigation via a callback function
await flow.navigate(async () => {
//   await page.click('a.link');
});

// Navigate with startNavigation/endNavigation
await flow.startNavigation();
// await page.click('a.link');
await flow.endNavigation();

await browser.close();
writeFileSync('report.html', await flow.generateReport());