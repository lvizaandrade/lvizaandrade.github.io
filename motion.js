(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  body.classList.add('motion-ready');

  const progress = document.createElement('div');
  progress.className = 'motion-progress';
  progress.setAttribute('aria-hidden', 'true');
  body.append(progress);
  const updateProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', updateProgress, { passive: true });
  addEventListener('resize', updateProgress);
  updateProgress();

  const revealSelector = [
    'main section', 'body > section', '.section-head', '.summary-card',
    '.work-card', '.cap-card', '.beat', '.phase', '.metric', '.ledger-row',
    '.phone', '.screen', '.pull', '.roadmap > *', '.tm-item'
  ].join(',');
  const items = [...document.querySelectorAll(revealSelector)]
    .filter(el => !el.closest('#edit-toolbar'));
  items.forEach((el, index) => {
    el.classList.add('motion-reveal');
    el.style.setProperty('--motion-delay', `${(index % 5) * 55}ms`);
  });

  if (reduce) items.forEach(el => el.classList.add('motion-in'));
  else {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('motion-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: .08, rootMargin: '0px 0px -7% 0px' });
    items.forEach(el => observer.observe(el));
  }

  const popSelector = '.work-card,.cap-card,.card,.summary-card,.phase,.metric,.phone,.screen,.beat,.rstep';
  document.querySelectorAll(popSelector).forEach(card => {
    card.classList.add('motion-pop');
    if (reduce) return;
    card.addEventListener('pointermove', event => {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--motion-ry', `${((event.clientX - box.left) / box.width - .5) * 3}deg`);
      card.style.setProperty('--motion-rx', `${((event.clientY - box.top) / box.height - .5) * -3}deg`);
    });
    card.addEventListener('pointerleave', () => {
      card.style.removeProperty('--motion-rx');
      card.style.removeProperty('--motion-ry');
    });
  });

  if (!reduce && matchMedia('(pointer:fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'motion-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    body.append(cursor);
    addEventListener('pointermove', event => {
      cursor.style.opacity = '1';
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    document.querySelectorAll('a,button,.motion-pop').forEach(el => {
      el.addEventListener('pointerenter', () => cursor.classList.add('is-active'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));
    });
  }
})();
