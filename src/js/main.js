/**
 * Site chrome: preload gate, desktop dropdown, mobile nav panel.
 * Vanilla replacement for jQuery + Dropotron + util.panel.
 */

function removePreload() {
  const done = () => document.body.classList.remove('is-preload');
  if (document.readyState === 'complete') {
    window.setTimeout(done, 100);
  } else {
    window.addEventListener('load', () => window.setTimeout(done, 100));
  }
}

function initDesktopDropdown() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  nav.querySelectorAll('.has-dropdown').forEach((item) => {
    const trigger = item.querySelector(':scope > a');
    if (!trigger) return;

    let closeTimer = null;

    const setOpen = (open) => {
      item.classList.toggle('is-open', open);
      trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
    };

    item.addEventListener('mouseenter', () => {
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = null;
      }
      setOpen(true);
    });

    item.addEventListener('mouseleave', () => {
      closeTimer = window.setTimeout(() => setOpen(false), 160);
    });

    // First click opens the menu; does not jump away and leave a stuck overlay
    trigger.addEventListener('click', (event) => {
      event.preventDefault();
      const willOpen = !item.classList.contains('is-open');
      setOpen(willOpen);
    });

    trigger.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setOpen(!item.classList.contains('is-open'));
      }
      if (event.key === 'Escape') setOpen(false);
    });

    item.addEventListener('focusout', (event) => {
      if (!item.contains(event.relatedTarget)) {
        setOpen(false);
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!nav.contains(event.target)) {
      nav.querySelectorAll('.has-dropdown.is-open').forEach((item) => {
        item.classList.remove('is-open');
        const trigger = item.querySelector(':scope > a');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

function buildNavListHtml(nav) {
  return [...nav.querySelectorAll('a')]
    .map((anchor) => {
      const li = anchor.closest('li');
      const nestedDepth = li?.parentElement?.classList.contains('dropdown') ? 1 : 0;
      const href = anchor.getAttribute('href') || '';
      const target = anchor.getAttribute('target');
      const label =
        anchor.querySelector('span:not(.sr-only)')?.textContent?.trim() ||
        anchor.textContent.trim().replace(/\s+/g, ' ');
      if (!label) return '';
      return (
        `<a class="link depth-${nestedDepth}"` +
        (target ? ` target="${target}"` : '') +
        (href ? ` href="${href}"` : '') +
        `><span class="indent-${nestedDepth}"></span>${label}</a>`
      );
    })
    .filter(Boolean)
    .join('');
}

function initMobileNav() {
  const nav = document.getElementById('nav');
  const body = document.body;
  if (!nav || document.getElementById('navPanel')) return;

  const titleBar = document.createElement('div');
  titleBar.id = 'titleBar';
  titleBar.innerHTML = '<button type="button" class="toggle" aria-label="Open menu" aria-controls="navPanel" aria-expanded="false"></button>';
  body.appendChild(titleBar);

  const panel = document.createElement('div');
  panel.id = 'navPanel';
  panel.innerHTML = `<nav>${buildNavListHtml(nav)}</nav>`;
  body.appendChild(panel);

  const menuButton = titleBar.querySelector('.toggle');
  const setVisible = (visible) => {
    body.classList.toggle('navPanel-visible', visible);
    menuButton.setAttribute('aria-expanded', visible ? 'true' : 'false');
    menuButton.setAttribute('aria-label', visible ? 'Close menu' : 'Open menu');
  };
  const toggle = () => setVisible(!body.classList.contains('navPanel-visible'));
  const hide = () => setVisible(false);

  menuButton.addEventListener('click', (event) => {
    event.preventDefault();
    toggle();
  });

  panel.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      hide();
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') hide();
  });

  // Swipe left to close
  let touchX = null;
  panel.addEventListener(
    'touchstart',
    (event) => {
      touchX = event.touches[0].pageX;
    },
    { passive: true }
  );
  panel.addEventListener(
    'touchend',
    (event) => {
      if (touchX === null) return;
      const dx = touchX - event.changedTouches[0].pageX;
      if (dx > 50) hide();
      touchX = null;
    },
    { passive: true }
  );
}

function initScrollTopOnLoad() {
  // Keep refresh / soft-open at the top of the page (avoid restoring mid-scroll).
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  const jumpTop = () => window.scrollTo(0, 0);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', jumpTop, { once: true });
  } else {
    jumpTop();
  }
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) jumpTop();
  });
}

function initBackToTop() {
  if (document.getElementById('backToTop')) return;

  const button = document.createElement('button');
  button.id = 'backToTop';
  button.type = 'button';
  button.className = 'back-to-top';
  button.setAttribute('aria-label', 'Back to top');
  button.innerHTML = '<span aria-hidden="true">↑</span>';
  document.body.appendChild(button);

  const toggle = () => {
    const show = window.scrollY > 480;
    button.classList.toggle('is-visible', show);
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0 });
  });

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();
}

function initProjectMarquee() {
  const marquee = document.querySelector('.project-marquee');
  const track = marquee?.querySelector('.project-grid');
  if (!marquee || !track || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  [...track.children].forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a').forEach((link) => link.setAttribute('tabindex', '-1'));
    track.appendChild(clone);
  });
}

export function initChrome() {
  initScrollTopOnLoad();
  removePreload();
  initDesktopDropdown();
  initMobileNav();
  initReveal();
  initBackToTop();
  initProjectMarquee();
}

function initReveal() {
  const nodes = document.querySelectorAll('.reveal');
  if (!nodes.length) return;

  if (!('IntersectionObserver' in window)) {
    nodes.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );

  nodes.forEach((el) => observer.observe(el));
}
