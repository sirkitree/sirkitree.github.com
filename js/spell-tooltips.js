/**
 * Quantum Weave Spell Tooltips
 * Displays hover information for spell references in narratives
 */

const SPELL_DATA = {
  'thermal-lock': {
    name: 'Thermal-Lock',
    altName: 'Temperature-Hold',
    discipline: 'Cryoarchitectonics',
    disciplineColor: '#B0E0E6',
    tier: 'Intermediate',
    function: 'Maintains object at exact temperature indefinitely regardless of environment. Creates perfect insulation—hot stays hot, cold stays cold.',
    duration: 'Sustained (hours to days with thread reinforcement)',
    threadCost: 'Moderate initial (20-30%), Low ongoing (2-5% per hour)',
    link: '/books/quantum-weave/disciplines/cryoarchitectonics/#thermal-lock'
  },
  'forge-heart': {
    name: 'Forge-Heart',
    altName: 'Thermal-Focus',
    discipline: 'Pyrosonics',
    disciplineColor: '#FF5722',
    tier: 'Intermediate',
    function: 'Creates point of extreme localized heat—up to 2000°C in fingertip-sized area. Can melt metal, weld, cauterize, or cut through materials with precision.',
    duration: 'Sustained (seconds to minutes)',
    threadCost: 'Moderate (20-35% depending on temperature and duration)',
    link: '/books/quantum-weave/disciplines/pyrosonics/#forge-heart'
  }
};

/**
 * Creates and returns a tooltip element for a spell
 * @param {Object} spellData - The spell data object
 * @returns {HTMLElement} The tooltip element
 */
function createTooltip(spellData) {
  const tooltip = document.createElement('div');
  tooltip.className = 'qw-spell-tooltip';

  tooltip.innerHTML = `
    <div class="qw-spell-tooltip-title">
      ${spellData.name}
      <span class="qw-spell-tooltip-discipline" style="color: ${spellData.disciplineColor}">
        ${spellData.discipline}
      </span>
    </div>
    <div class="qw-spell-tooltip-tier">${spellData.tier} Tier</div>
    <div class="qw-spell-tooltip-description">
      ${spellData.function}
    </div>
    <div class="qw-spell-tooltip-meta">
      <div><strong>Duration:</strong> ${spellData.duration}</div>
      <div><strong>Thread Cost:</strong> ${spellData.threadCost}</div>
    </div>
    <a href="${spellData.link}" class="qw-spell-tooltip-link">View full spell details →</a>
  `;

  return tooltip;
}

/**
 * Initializes spell tooltips on the page
 */
function initSpellTooltips() {
  const spellElements = document.querySelectorAll('.qw-spell[data-spell]');

  spellElements.forEach(element => {
    const spellId = element.getAttribute('data-spell');
    const spellData = SPELL_DATA[spellId];

    if (!spellData) {
      console.warn(`No spell data found for: ${spellId}`);
      return;
    }

    // Create and append tooltip
    const tooltip = createTooltip(spellData);
    element.appendChild(tooltip);

    // Adjust tooltip position if it would go off-screen
    element.addEventListener('mouseenter', () => {
      const rect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;

      // If tooltip goes off right edge, adjust position
      if (rect.right > viewportWidth - 20) {
        tooltip.style.left = 'auto';
        tooltip.style.right = '0';
        tooltip.style.transform = 'translateX(0) translateY(0)';
      }

      // If tooltip goes off left edge, adjust position
      if (rect.left < 20) {
        tooltip.style.left = '0';
        tooltip.style.right = 'auto';
        tooltip.style.transform = 'translateX(0) translateY(0)';
      }

      // If tooltip goes off top of viewport, show below instead
      if (rect.top < 20) {
        tooltip.style.bottom = 'auto';
        tooltip.style.top = '100%';
        tooltip.style.marginTop = '8px';
        tooltip.style.marginBottom = '0';
      }
    });
  });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSpellTooltips);
} else {
  initSpellTooltips();
}
