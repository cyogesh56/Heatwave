const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.error('ERROR:', err.message));
  
  await page.goto('http://localhost:5173');
  await page.click('text="Host Room"');
  await page.waitForTimeout(500);
  
  // Fake two players joining via localStorage trick or just API
  await page.evaluate(() => {
     window.dispatchEvent(new CustomEvent('presence-sync', { detail: { connectedIds: ['p1', 'p2'] } }));
  });
  
  await page.waitForTimeout(500);
  await page.click('text="Start Heatwave"');
  
  await page.waitForTimeout(4000); // Wait for transition
  const bodyHTML = await page.evaluate(() => document.body.innerHTML);
  const rootHTML = await page.evaluate(() => document.getElementById('root').innerHTML);
  console.log('ROOT_HTML_LENGTH:', rootHTML.length);
  if (rootHTML.length < 100) console.log(rootHTML);
  
  await browser.close();
})();
