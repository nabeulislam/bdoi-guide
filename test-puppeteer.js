const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request => console.log('REQUEST FAILED:', request.url(), request.failure().errorText));

  await page.goto('http://localhost:3000/intro/getting-started', { waitUntil: 'networkidle0' });
  
  console.log('Page loaded. Clicking Next button...');
  const nextLinks = await page.$$('a[href="/intro/io-and-data-types"]');
  if (nextLinks.length > 0) {
    await nextLinks[0].click();
    await page.waitForNavigation({ waitUntil: 'networkidle0' }).catch(e => console.log('Nav timeout'));
    console.log('New URL:', page.url());
  } else {
    console.log('Next link not found');
  }

  await browser.close();
})();
