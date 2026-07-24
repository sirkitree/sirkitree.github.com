// Archive filtering: collection chips + live text search.
//
// Everything is rendered server-side; this only hides rows. With no JS the page
// is still a complete, readable archive — the controls just sit inert.

(function () {
  const root = document.querySelector('.archive');
  if (!root) return;

  const search = root.querySelector('#archive-search');
  const chips = [...root.querySelectorAll('.af-chip')];
  const items = [...root.querySelectorAll('.archive-item')];
  const years = [...root.querySelectorAll('.archive-year')];
  const status = root.querySelector('.archive-status');
  const empty = root.querySelector('.archive-empty');
  const seriesNote = root.querySelector('.archive-series-note');

  let filter = 'all';
  let query = '';

  function apply() {
    let visible = 0;

    for (const item of items) {
      const matchesGroup = filter === 'all' || item.dataset.group === filter;
      const matchesQuery = !query || item.dataset.search.includes(query);
      const show = matchesGroup && matchesQuery;
      item.hidden = !show;
      if (show) visible++;
    }

    // Collapse year headings that have nothing left under them.
    for (const year of years) {
      const shown = year.querySelectorAll('.archive-item:not([hidden])').length;
      year.hidden = shown === 0;
      const count = year.querySelector('.ay-count');
      if (count) count.textContent = shown;
    }

    empty.hidden = visible > 0;
    if (seriesNote) {
      seriesNote.hidden = !(filter === seriesNote.dataset.forFilter && visible > 0);
    }

    const scoped = filter === 'all' && !query;
    status.textContent = scoped ? '' : visible + (visible === 1 ? ' post' : ' posts');
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      filter = chip.dataset.filter;
      chips.forEach((c) => {
        const active = c === chip;
        c.classList.toggle('is-active', active);
        c.setAttribute('aria-pressed', String(active));
      });
      apply();
    });
  });

  if (search) {
    search.addEventListener('input', () => {
      query = search.value.trim().toLowerCase();
      apply();
    });
    // Let Escape clear the box without leaving the keyboard.
    search.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && search.value) {
        search.value = '';
        query = '';
        apply();
      }
    });
  }

  // Deep links like /archive/#jenney open straight into a collection.
  const hash = (location.hash || '').replace('#', '');
  const preset = chips.find((c) => c.dataset.filter === hash);
  if (preset) preset.click();
})();
