const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message));
  
  await page.goto('http://localhost:5173/');
  console.log("Navigated to page");
  
  await page.click('.me-misi-card[data-misi="misi1"]');
  console.log("Clicked Misi 1");
  
  await page.waitForTimeout(1000);
  await page.click('#hookContinue');
  console.log("Clicked Hook Continue");
  
  await page.waitForTimeout(1000);
  await page.click('#btnMasuk');
  console.log("Clicked btnMasuk (Enter AR)");
  
  await page.waitForTimeout(5000); // Wait to see if error happens
  console.log("Done waiting");
  
  await browser.close();
})();
