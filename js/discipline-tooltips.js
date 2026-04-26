/**
 * Quantum Weave inline link enhancers
 * - Auto-wraps discipline names in narrative prose with hover tooltips
 *   linking to the discipline page.
 * - Auto-wraps other character names in narrative prose with links to
 *   their character profile (skipping self-references on the active page).
 */

const DISCIPLINE_DATA = {
  infomancy: {
    name: 'Infomancy',
    code: 'Sc1',
    color: '#00E5FF',
    summary: 'Data and communication. Information flow, pattern recognition, memory work, and encrypted thread channels.'
  },
  fabricurgy: {
    name: 'Fabricurgy',
    code: 'Sc2',
    color: '#C0C0C0',
    summary: 'Textiles and materials. Flexible composites, fiber work, and woven Thread reinforcement.'
  },
  corpus: {
    name: 'Corpus',
    code: 'Sc3',
    color: '#A8D5BA',
    summary: 'Bodies and healing. Tissue regeneration, bone reconstruction, and biological repair.'
  },
  pyrosonics: {
    name: 'Pyrosonics',
    code: 'Sc4',
    color: '#FF5722',
    summary: 'Sound and heat. Sonic resonance, thermal control, and vibration manipulation.'
  },
  spectra: {
    name: 'Spectra',
    code: 'Sc5',
    color: '#C77DFF',
    summary: 'Light and illusion. Refraction, holography, invisibility, and color manipulation.'
  },
  cryoarchitectonics: {
    name: 'Cryoarchitectonics',
    code: 'Sc6',
    color: '#B0E0E6',
    summary: 'Cold and preservation. Crystallization, structural reinforcement, entropy slowing.'
  },
  luxomancy: {
    name: 'Luxomancy',
    code: 'Sc7',
    color: '#FFB84D',
    summary: 'Emotion and frequency. Mood shaping, empathic reading, and resonance with electromagnetic hue.'
  },
  terraducts: {
    name: 'Terraducts',
    code: 'Sc8',
    color: '#5D4E37',
    summary: 'Earth, metals, and gravity. Stone and metal shaping, and gravitational anchoring.'
  },
  floramancy: {
    name: 'Floramancy',
    code: 'Sc9',
    color: '#52B788',
    summary: 'Plant life and ecosystems. Growth acceleration, mycorrhizal networks, and living architecture.'
  }
};

const CHARACTER_DATA = {
  'mira-caldwell': { name: 'Mira Caldwell', first: 'Mira', role: 'Master Healer · Age 42', color: '#A8D5BA' },
  'silas-greythorne': { name: 'Silas Greythorne', first: 'Silas', role: 'Rogue Architect · Age 37', color: '#B49664' },
  'yara-venn': { name: 'Yara Venn', first: 'Yara', role: 'Young Outlier · Age 19', color: '#C77DFF' },
  'vex-mortain': { name: 'Vex Mortain', first: 'Vex', role: 'Shadow Operative · Age 34', color: '#00E5FF' },
  'thera-moss': { name: 'Thera Moss', first: 'Thera', role: 'Restoration Ecologist · Age 29', color: '#52B788' },
  'rowan-marrick': { name: 'Rowan Marrick', first: 'Rowan', role: 'Truthseeker · Age 29', color: '#00E5FF' },
  'torin-ashwright': { name: 'Torin Ashwright', first: 'Torin', role: 'Forge Master · Age 52', color: '#FF5722' },
  'kael-theron': { name: 'Kael Theron', first: 'Kael', role: 'Quantum Scholar · Age 48', color: '#00E5FF' }
};

const DISCIPLINE_NAMES = Object.values(DISCIPLINE_DATA).map(d => d.name);
const DISCIPLINE_PATTERN = new RegExp('\\b(' + DISCIPLINE_NAMES.join('|') + ')\\b', 'g');

// Full names first so the regex prefers "Mira Caldwell" over "Mira" alone.
const CHARACTER_FULL_NAMES = Object.values(CHARACTER_DATA).map(d => d.name);
const CHARACTER_FIRST_NAMES = Object.values(CHARACTER_DATA).map(d => d.first);
const CHARACTER_PATTERN = new RegExp('\\b(' + [...CHARACTER_FULL_NAMES, ...CHARACTER_FIRST_NAMES].join('|') + ')\\b', 'g');

const NAME_TO_SLUG = {};
Object.entries(CHARACTER_DATA).forEach(([slug, data]) => {
  NAME_TO_SLUG[data.name] = slug;
  NAME_TO_SLUG[data.first] = slug;
});

const SKIP_SELECTOR = [
  'a',
  '.qw-discipline-link',
  '.qw-discipline-badge',
  '.qw-character-link',
  '.qw-character-name',
  '.qw-character-role',
  '.qw-character-summary',
  '.qw-spell',
  '.character-quick-stats',
  '.qw-hero-title',
  '.qw-hero-subtitle',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6'
].join(', ');

function getCurrentCharacterSlug() {
  const m = window.location.pathname.match(/\/books\/quantum-weave\/characters\/([^/]+)/);
  return m ? m[1] : null;
}

function collectTextNodes(root, pattern) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.parentElement) return NodeFilter.FILTER_REJECT;
      if (node.parentElement.closest(SKIP_SELECTOR)) return NodeFilter.FILTER_REJECT;
      pattern.lastIndex = 0;
      const ok = pattern.test(node.textContent);
      pattern.lastIndex = 0;
      return ok ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    }
  });
  const nodes = [];
  let n;
  while ((n = walker.nextNode())) nodes.push(n);
  return nodes;
}

function buildDisciplineSpan(slug, matched) {
  const data = DISCIPLINE_DATA[slug];
  const span = document.createElement('span');
  span.className = 'qw-discipline-link';
  span.dataset.discipline = slug;
  span.textContent = matched;
  span.style.setProperty('--discipline-color', data.color);

  const tip = document.createElement('span');
  tip.className = 'qw-discipline-link-tooltip';
  tip.setAttribute('role', 'tooltip');
  tip.innerHTML = `
    <span class="qw-discipline-link-tooltip-title" style="color: ${data.color}">${data.code} · ${data.name}</span>
    <span class="qw-discipline-link-tooltip-summary">${data.summary}</span>
    <a class="qw-discipline-link-tooltip-link" href="/books/quantum-weave/disciplines/${slug}/">View discipline →</a>
  `;
  span.appendChild(tip);
  return span;
}

function buildCharacterLink(slug, matched) {
  const data = CHARACTER_DATA[slug];
  const link = document.createElement('a');
  link.className = 'qw-character-link';
  link.href = `/books/quantum-weave/characters/${slug}/`;
  link.dataset.character = slug;
  link.textContent = matched;
  link.style.setProperty('--character-color', data.color);

  const tip = document.createElement('span');
  tip.className = 'qw-character-link-tooltip';
  tip.setAttribute('role', 'tooltip');
  tip.innerHTML = `
    <span class="qw-character-link-tooltip-name" style="color: ${data.color}">${data.name}</span>
    <span class="qw-character-link-tooltip-role">${data.role}</span>
    <span class="qw-character-link-tooltip-cta">View profile →</span>
  `;
  link.appendChild(tip);
  return link;
}

function wrapMatches(root, pattern, factory) {
  const nodes = collectTextNodes(root, pattern);
  for (const node of nodes) {
    pattern.lastIndex = 0;
    const text = node.textContent;
    const frag = document.createDocumentFragment();
    let lastIdx = 0;
    let made = false;
    let match;
    while ((match = pattern.exec(text)) !== null) {
      if (match.index > lastIdx) {
        frag.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
      }
      const replacement = factory(match[1]);
      if (replacement) {
        frag.appendChild(replacement);
        made = true;
      } else {
        // factory returned null → leave as plain text
        frag.appendChild(document.createTextNode(match[1]));
      }
      lastIdx = pattern.lastIndex;
    }
    if (!made) continue;
    if (lastIdx < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIdx)));
    }
    node.parentNode.replaceChild(frag, node);
  }
}

function restructureCharacterPage() {
  const hero = document.querySelector('.character-hero');
  if (!hero) return;
  if (document.querySelector('.character-page-layout')) return;

  const portrait = hero.querySelector('.character-portrait');
  if (!portrait) return;

  const characterAttr = hero.dataset.character || null;
  const heroParent = hero.parentNode;

  const layout = document.createElement('div');
  layout.className = 'character-page-layout';
  if (characterAttr) layout.dataset.character = characterAttr;

  const portraitCol = document.createElement('aside');
  portraitCol.className = 'character-portrait-column';

  const mainCol = document.createElement('div');
  mainCol.className = 'character-main-column';

  // Insert layout in place of hero
  heroParent.insertBefore(layout, hero);

  // Collect every sibling from hero onward (those become main-column content)
  const toMove = [];
  let cur = hero;
  while (cur) {
    toMove.push(cur);
    cur = cur.nextElementSibling;
  }

  // Detach portrait from hero before the hero itself moves
  portrait.parentNode.removeChild(portrait);
  portraitCol.appendChild(portrait);

  toMove.forEach(el => mainCol.appendChild(el));

  layout.appendChild(portraitCol);
  layout.appendChild(mainCol);
}

function initInlineLinks() {
  const containers = document.querySelectorAll('.character-narrative');
  if (!containers.length) return;
  const currentSlug = getCurrentCharacterSlug();

  containers.forEach(c => {
    // Disciplines first.
    wrapMatches(c, DISCIPLINE_PATTERN, (matched) => {
      const slug = matched.toLowerCase();
      if (!DISCIPLINE_DATA[slug]) return null;
      return buildDisciplineSpan(slug, matched);
    });

    // Other characters second; skip self-references.
    wrapMatches(c, CHARACTER_PATTERN, (matched) => {
      const slug = NAME_TO_SLUG[matched];
      if (!slug || slug === currentSlug) return null;
      return buildCharacterLink(slug, matched);
    });
  });
}

function init() {
  restructureCharacterPage();
  initInlineLinks();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
