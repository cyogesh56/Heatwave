import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';

(async () => {
  console.log('Starting Vite server...');
  const server = spawn('npm', ['run', 'dev', '--', '--port', '5173'], { stdio: 'pipe' });
  
  await new Promise(resolve => setTimeout(resolve, 3000)); // wait for server

  console.log('Launching Puppeteer...');
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  const artifactDir = '/Users/cyogesh56/.gemini/antigravity/brain/28dac787-1c06-4bf3-b4f8-6d6a8d8ba23b';

  console.log('Taking Landing screenshot...');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:5173/');
  await page.screenshot({ path: path.join(artifactDir, 'landing.png') });

  console.log('Taking Lobby screenshot...');
  await page.goto('http://localhost:5173/lobby');
  await page.screenshot({ path: path.join(artifactDir, 'lobby.png') });

  console.log('Taking Host screenshot...');
  await page.goto('http://localhost:5173/host');
  await page.screenshot({ path: path.join(artifactDir, 'host.png') });

  console.log('Taking Play screenshot (Mobile)...');
  await page.emulate(puppeteer.KnownDevices['iPhone 13']);
  await page.goto('http://localhost:5173/play');
  await page.screenshot({ path: path.join(artifactDir, 'play.png') });

  await browser.close();
  server.kill();
  console.log('Screenshots saved!');
  process.exit(0);
})();
