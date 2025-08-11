#!/usr/bin/env node
// Capture a 3D book screenshot from the local dev server using Puppeteer
// Requires: npm i puppeteer

const fs = require('fs');
const path = require('path');

async function run() {
  const puppeteer = require('puppeteer');
  const url = process.env.URL || 'http://127.0.0.1:4000/books/learning-your-childrens-names-again/mockup/';
  const outPath = path.resolve(__dirname, '..', 'assets', 'books', 'learning-your-childrens-names-again', 'cover-3d.jpg');
  const viewport = { width: 1920, height: 1080, deviceScaleFactor: 2 };

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport(viewport);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

  // wait a moment for three to settle auto-rotate
  await page.waitForSelector('#book3d canvas', { timeout: 20000 });
  await new Promise(r => setTimeout(r, 1200));

  const element = await page.$('#book3d');
  if (!element) throw new Error('book3d element not found');

  const buf = await element.screenshot({ type: 'jpeg', quality: 90 });
  fs.writeFileSync(outPath, buf);
  console.log('Saved', outPath);
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


