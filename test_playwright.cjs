const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('BROWSER_LOG:', msg.text()));
  page.on('pageerror', error => console.error('BROWSER_ERROR:', error));
  
  await page.goto('http://localhost:5173');
  // Click "Host Room"
  await page.click('text="Host Room"');
  await page.waitForTimeout(1000);
  
  // Now in Lobby, click "Start Heatwave"
  // Wait, Start Heatwave is disabled until 2+ players!
  // I need to join with 2 players...
  console.log('Test completed up to lobby');
  await browser.close();
})();
