(function () {
  const root = document.documentElement;

  /* ---------- Tabs ---------- */
  const tabs = Array.from(document.querySelectorAll('[role="tab"]'));
  const panels = Array.from(document.querySelectorAll('[role="tabpanel"]'));
  const ids = panels.map(p => p.dataset.tab); // hash names, e.g. #research
  const names = { about: 'About', research: 'Research', publications: 'Publications', experience: 'Experience', education: 'Education', skills: 'Skills', contact: 'Contact' };

  function show(id, focusTab) {
    if (!ids.includes(id)) id = 'about';
    panels.forEach(p => { p.hidden = p.dataset.tab !== id; });
    tabs.forEach(t => {
      const on = t.getAttribute('href') === '#' + id;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (on && t.offsetParent) {
        if (focusTab) t.focus();
        // keep the active pill visible in the horizontally scrolling mobile row
        const row = t.closest('nav');
        if (row && row.scrollWidth > row.clientWidth) row.scrollLeft = t.offsetLeft - 16;
      }
    });
    document.title = id === 'about'
      ? 'Adiel Tuyishime — Software Engineer & Researcher in MDE'
      : `${names[id]} · Adiel Tuyishime`;
  }

  function go(id, focusTab) {
    history.pushState(null, '', '#' + id);
    show(id, focusTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Any in-page link to a tab (nav, buttons, footer) switches tabs
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href').slice(1);
    if (!ids.includes(id)) return;
    e.preventDefault();
    go(id);
  });

  // Arrow keys move between tabs within a tab list
  document.querySelectorAll('[role="tablist"]').forEach(list => {
    const own = Array.from(list.querySelectorAll('[role="tab"]'));
    list.addEventListener('keydown', e => {
      const i = own.indexOf(document.activeElement);
      if (i < 0) return;
      const map = { ArrowRight: (i + 1) % own.length, ArrowLeft: (i - 1 + own.length) % own.length, Home: 0, End: own.length - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      go(own[map[e.key]].getAttribute('href').slice(1), true);
    });
  });

  window.addEventListener('popstate', () => show(location.hash.slice(1)));
  show(location.hash.slice(1));

  /* ---------- Light / dark mode ---------- */
  // Moon shows in light mode, sun in dark mode (handled by Tailwind's dark: classes).
  const toggles = document.querySelectorAll('.theme-toggle');
  function syncLabels() {
    const dark = root.classList.contains('dark');
    toggles.forEach(b => {
      const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
      b.setAttribute('aria-label', label);
      b.title = label;
    });
  }
  toggles.forEach(b => b.addEventListener('click', () => {
    const dark = root.classList.toggle('dark');
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (e) {}
    syncLabels();
  }));
  syncLabels();

  document.getElementById('y').textContent = new Date().getFullYear();
})();
