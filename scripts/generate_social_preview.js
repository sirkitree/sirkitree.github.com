// Renders scripts/social-card.html to assets/social-preview.png at 1200x630,
// the size Facebook, LinkedIn, Slack, and X all expect for link previews.
//
// The card is HTML rather than SVG on purpose: social platforms won't render an
// SVG og:image, and rendering through Chrome means the card picks up the same
// Google Fonts the site uses instead of approximating them.
//
//   node scripts/generate_social_preview.js

const puppeteer = require('puppeteer');
const path = require('path');

const CARD = path.join(__dirname, 'social-card.html');
const OUT = path.join(__dirname, '..', 'assets', 'social-preview.png');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 1 });
  await page.goto('file://' + CARD, { waitUntil: 'networkidle0' });

  // Webfonts come off the network; bail loudly rather than shipping a card that
  // silently fell back to system sans.
  await page.evaluateHandle('document.fonts.ready');
  const ok = await page.evaluate(() => document.fonts.check('800 96px Inter'));
  if (!ok) {
    await browser.close();
    console.error('Inter did not load — check network access, card not written.');
    process.exit(1);
  }

  await page.screenshot({ path: OUT, type: 'png' });
  await browser.close();
  console.log('Wrote ' + OUT);
})();
