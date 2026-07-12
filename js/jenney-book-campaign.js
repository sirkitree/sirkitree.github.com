(function () {
  const callout = document.querySelector('[data-jenney-book-callout]');

  if (!callout) {
    return;
  }

  const sourceHosts = [
    { key: 'cbsnews', host: 'cbsnews.com' },
    { key: 'aol', host: 'aol.ca' }
  ];

  function getSourceFromReferrer() {
    try {
      if (!document.referrer) {
        return '';
      }

      const referrerHost = new URL(document.referrer).hostname.replace(/^www\./, '');
      const match = sourceHosts.find((source) => referrerHost === source.host || referrerHost.endsWith(`.${source.host}`));

      return match ? match.key : '';
    } catch (error) {
      return '';
    }
  }

  function getCampaignSource() {
    const referrerSource = getSourceFromReferrer();

    if (referrerSource) {
      try {
        sessionStorage.setItem('jenneyBookCampaignSource', referrerSource);
      } catch (error) {
        return referrerSource;
      }

      return referrerSource;
    }

    try {
      return sessionStorage.getItem('jenneyBookCampaignSource') || 'default';
    } catch (error) {
      return 'default';
    }
  }

  function personalizeCallout(source) {
    if (source !== 'cbsnews' && source !== 'aol') {
      return;
    }

    const headline = callout.querySelector('[data-jenney-book-headline]');
    const copy = callout.querySelector('[data-jenney-book-copy]');

    if (headline) {
      headline.textContent = "Coming from Jenney's story?";
    }

    if (copy) {
      copy.innerHTML = "These journal entries are where I processed the days behind the headlines. I later shaped that story into <em>Learning Your Children's Names Again</em>, a memoir about Jenney's cancer, recovery, faith, and family life on the other side.";
    }
  }

  function placeCalloutMidArticle() {
    const content = document.querySelector('.post .content');

    if (!content) {
      return;
    }

    const paragraphs = Array.from(content.querySelectorAll(':scope > p'));

    if (paragraphs.length < 5) {
      return;
    }

    paragraphs[3].insertAdjacentElement('afterend', callout);
  }

  function trackClicks(source) {
    callout.addEventListener('click', (event) => {
      const link = event.target.closest('[data-jenney-book-link]');

      if (!link || typeof window.gtag !== 'function') {
        return;
      }

      window.gtag('event', 'jenney_book_callout_click', {
        campaign_source: source,
        link_target: link.dataset.jenneyBookLink,
        link_url: link.href
      });
    });
  }

  const source = getCampaignSource();

  personalizeCallout(source);
  placeCalloutMidArticle();
  trackClicks(source);
})();
