// Fade-to-background page transitions.
//
// Clicking an internal link fades the page out, then navigates. The new page
// fades back in from the same color, so the two halves read as one motion.
// The fade-in is a pure CSS animation triggered by a class set in <head>, so a
// JS failure can never leave the overlay stuck over the content.

(function () {
  const DURATION = 260; // keep in sync with --page-transition-duration in main.css
  const root = document.documentElement;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduceMotion.matches) {
    root.classList.remove('pt-enter');
    return;
  }

  // Clear the entering class once the fade-in animation has run.
  window.setTimeout(() => root.classList.remove('pt-enter'), DURATION + 100);

  function shouldIntercept(event, link) {
    if (event.defaultPrevented) return false;
    if (event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (!link || link.hasAttribute('download')) return false;
    if (link.dataset.noTransition !== undefined) return false;
    if (link.target && link.target !== '_self') return false;

    const url = new URL(link.href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return false;
    // Let in-page anchors and identical URLs behave normally.
    if (url.href === window.location.href) return false;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return false;

    return true;
  }

  let leaving = false;

  document.addEventListener('click', (event) => {
    const link = event.target.closest && event.target.closest('a[href]');
    if (!link || !shouldIntercept(event, link)) return;

    event.preventDefault();
    if (leaving) return;
    leaving = true;

    const destination = link.href;
    try {
      sessionStorage.setItem('pageTransition', '1');
    } catch (e) {
      // Private mode or storage disabled — the fade-out still runs.
    }

    root.classList.add('pt-leave');
    window.setTimeout(() => {
      window.location.href = destination;
    }, DURATION);
  });

  // Restoring from the back/forward cache keeps whatever classes were set when
  // the page was frozen mid-fade, so reset them.
  window.addEventListener('pageshow', (event) => {
    if (!event.persisted) return;
    leaving = false;
    root.classList.remove('pt-leave', 'pt-enter');
  });
})();
