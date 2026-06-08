const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const logs = [];
  page.on('console', msg => logs.push(`[${msg.type()}] ${msg.text()}`));
  page.on('pageerror', err => logs.push(`[error] ${err.message}`));
  await page.goto('http://localhost:3000/intro/getting-started');
  await page.waitForTimeout(2000);
  console.log(logs.join('\n'));
  await browser.close();
})();
