#!/usr/bin/env node
// Capture a 3D book screenshot from the local dev server using Puppeteer
// Requires: npm i puppeteer

const fs = require('fs');
const path = require('path');

async function run() {
  const puppeteer = require('puppeteer');
  const url = process.env.URL || 'http://127.0.0.1:4000/books/learning-your-childrens-names-again/';
  const outPath = path.resolve(__dirname, '..', 'assets', 'books', 'learning-your-childrens-names-again', 'cover-3d.jpg');
  const viewport = { width: 1600, height: 1000, deviceScaleFactor: 2 };

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

  const clip = await element.boundingBox();
  // Add padding around element for composition
  const pad = 20;
  const clipRect = {
    x: Math.max(0, clip.x - pad),
    y: Math.max(0, clip.y - pad),
    width: clip.width + pad * 2,
    height: clip.height + pad * 2
  };

  const buf = await page.screenshot({
    type: 'jpeg',
    quality: 90,
    clip: clipRect,
  });
  fs.writeFileSync(outPath, buf);
  console.log('Saved', outPath);
  await browser.close();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});


