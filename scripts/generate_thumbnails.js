const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const http = require('http');
const handler = require('serve-handler');

// The script lives in the "scripts" directory but most of the resources it
// needs (websim-projects, assets, node_modules) live at the repository root.
// Resolve all paths relative to the repo root so the script can be executed
// from anywhere without failing to locate these directories.
const ROOT_DIR = path.join(__dirname, '..');

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function startServer() {
  const server = http.createServer((request, response) => {
    return handler(request, response, {
      // Serve files from the repository root so that websim-projects and other
      // assets can be found correctly.
      public: ROOT_DIR
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
  
  const websimDir = path.join(ROOT_DIR, 'websim-projects');
  const thumbnailDir = path.join(ROOT_DIR, 'assets', 'websim-thumbnails');
  
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
// The script might be executed before dependencies are installed. Check for
// serve-handler inside the repo's node_modules directory and install it if
// missing.
if (!fs.existsSync(path.join(ROOT_DIR, 'node_modules', 'serve-handler'))) {
  console.log('Installing serve-handler...');
  require('child_process').execSync('npm install serve-handler', {
    stdio: 'inherit',
    cwd: ROOT_DIR,
  });
}

generateThumbnails().catch(console.error); 