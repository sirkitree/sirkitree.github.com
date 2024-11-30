const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startServer() {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      public: __dirname
    });
  });
  
  await new Promise((resolve) => {
    server.listen(3001, () => {
      console.log('Server running at http://localhost:3001');
      resolve();
    });
  });
  
  return server;
}

async function generateThumbnails() {
  const server = await startServer();
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600 });
  
  const websimDir = path.join(__dirname, 'websim-projects');
  const thumbnailDir = path.join(__dirname, 'assets', 'websim-thumbnails');
  
  // Create thumbnails directory if it doesn't exist
  if (!fs.existsSync(thumbnailDir)) {
    fs.mkdirSync(thumbnailDir, { recursive: true });
  }
  
  const files = fs.readdirSync(websimDir).filter(file => file.endsWith('.html'));
  
  for (const file of files) {
    const thumbnailPath = path.join(thumbnailDir, file.replace('.html', '.png'));
    
    console.log(`Generating thumbnail for ${file}...`);
    
    try {
      // Load the file through the local server
      await page.goto(`http://localhost:3001/websim-projects/${file}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });
      
      // Wait for any animations to start
      await delay(2000);
      
      // Take the screenshot
      await page.screenshot({
        path: thumbnailPath,
        type: 'png',
        omitBackground: true,
        clip: {
          x: 0,
          y: 0,
          width: 800,
          height: 600
        }
      });
      
      console.log(`Created thumbnail: ${thumbnailPath}`);
    } catch (error) {
      console.error(`Error generating thumbnail for ${file}:`, error);
    }
  }
  
  await browser.close();
  server.close();
}

// Install serve-handler if not already installed
if (!fs.existsSync(path.join(__dirname, 'node_modules', 'serve-handler'))) {
  console.log('Installing serve-handler...');
  require('child_process').execSync('npm install serve-handler', { stdio: 'inherit' });
}

generateThumbnails().catch(console.error); 