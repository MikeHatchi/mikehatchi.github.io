/* travis::iv — page behaviour: language, Travis's conversation, stage, news, work, path. */
(function () {
  const CFG = window.TRAVIS_CONFIG;
  const DATA = window.TRAVIS_DATA;
  const I18N = window.TRAVIS_I18N;
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}, kids = []) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) {
      if (v === null || v === undefined || v === false) continue;
      if (k === 'text') n.textContent = v;
      else if (k === 'class') n.className = v;
      else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
      else n.setAttribute(k, v === true ? '' : v);
    }
    for (const c of [].concat(kids)) if (c) n.append(c);
    return n;
  };
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  const state = {
    lang: store.get('travis.lang') || ((navigator.language || 'en').toLowerCase().startsWith('fr') ? 'fr' : 'en'),
    history: [],          // in memory only, never stored
    news: [],
    openId: null,
    chatting: false,      // welcome screen until the visitor engages
    busy: false
  };
  const L = (o) => (o && typeof o === 'object' ? o[state.lang] : o);
  const UI = () => I18N[state.lang];

  /* ── language ────────────────────────────────────────── */
  function applyLang() {
    document.documentElement.lang = state.lang;
    document.querySelectorAll('[data-i18n]').forEach((n) => { const v = UI()[n.dataset.i18n]; if (typeof v === 'string') n.textContent = v; });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((n) => { n.placeholder = UI()[n.dataset.i18nPlaceholder]; });
    document.querySelectorAll('[data-i18n-aria]').forEach((n) => { n.setAttribute('aria-label', UI()[n.dataset.i18nAria]); });
    $('#ask-input').dispatchEvent(new Event('input'));   // refit the field to the new placeholder
    document.querySelectorAll('.lang button').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.lang === state.lang))); renderNews(); renderTopics();
    if (state.openId) renderProject(state.openId);
  }
  function setLang(lang) {
    if (lang === state.lang) return;
    state.lang = lang; store.set('travis.lang', lang);
    applyLang();
    turn = null;
    if (state.chatting) say(UI().t.greet, { chips: Travis.chipsFor(lang, 'home') });
    else { log.replaceChildren(); state.history = []; welcome(); }
  }

  /* ── contact links ───────────────────────────────────── */
  function setupContact() {
    const c = CFG.contact || {};
    // The links are written in index.html (robots and link previews don't run JavaScript); config.js
    // may update them, and an empty entry hides its link. (GitHub is the three-account menu below)
    const pairs = [['#link-linkedin', c.linkedin], ['#link-discord', c.discord]];
    for (const [sel, href] of pairs) {
      const a = $(sel);
      if (href) a.href = href;
      else { a.hidden = true; const s = a.nextElementSibling; if (s && s.classList.contains('sep')) s.hidden = true; }
    }
  }

  /* ── Travis speaking ─────────────────────────────────── */
  // A Travis turn, after the Agent Chat component (Cyedi Creative Studio,
  // licensed for this site): name with a sparkle, three bouncing dots while
  // thinking, tool-call cards (Running… → Done), then the reply streaming word
  // by word in a bubble. Ported to plain JS/CSS, in black and white.
  const log = $('#log');
  const chipsBox = $('#chips');
  let turn = null;          // the Travis turn being written
  let thinking = null;      // its bouncing dots, until something happens
  let pending = Promise.resolve();   // tool calls of this turn: the reply waits for them

  // Pacing, as in the component (ms)
  const PACE = { thinking: 1300, tool: 600, afterTool: 200, word: 40, maxStream: 1800 };

  function mood(m) {
    document.body.classList.toggle('is-thinking', m === 'thinking');
    document.body.classList.toggle('is-talking', m === 'talking');
    if (window.TravisAvatar) TravisAvatar.setMood(m || (document.body.classList.contains('is-listening') ? 'listening' : 'idle'));
  }
  function scrollLog() { log.scrollTop = log.scrollHeight; }
  // Fade the top edge once there is something scrolled out of view above
  log.addEventListener('scroll', () => log.classList.toggle('is-scrolled', log.scrollTop > 4), { passive: true });
  const wait = (ms) => new Promise((r) => setTimeout(r, reduced ? 0 : ms));

  function svg(path, cls) {
    const NS = 'http://www.w3.org/2000/svg';
    const s = document.createElementNS(NS, 'svg');
    s.setAttribute('viewBox', '0 0 24 24');
    s.setAttribute('aria-hidden', 'true');
    s.setAttribute('class', cls);
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', path);
    s.append(p);
    return s;
  }
  const SPARKLE = 'M12 3c.6 4.6 2.4 6.4 7 7-4.6.6-6.4 2.4-7 7-.6-4.6-2.4-6.4-7-7 4.6-.6 6.4-2.4 7-7Z';
  const BRACKETS = 'M7 5H5v14h2M17 5h2v14h-2M10 12h4';

  function ensureTurn() {
    if (!turn) {
      turn = el('div', { class: 'turn' }, [
        el('p', { class: 'turn-head' }, [svg(SPARKLE, 'sparkle'), 'travis'])
      ]);
      log.append(turn);
      pending = Promise.resolve();
    }
    if (thinking) { thinking.remove(); thinking = null; turn.classList.remove('is-thinking'); }
    return turn;
  }
  function think() {
    ensureTurn();
    thinking = el('div', { class: 'dots' }, [
      el('span', { class: 'visually-hidden', text: UI().thinking }),
      el('i'), el('i'), el('i')
    ]);
    turn.append(thinking);
    turn.classList.add('is-thinking');   // the sparkle spins
    mood('thinking');
    scrollLog();
  }

  let typing = 0;
  // Streams a reply word by word with a blinking bar; a click shows it all at once
  function stream(node, text) {
    const complete = () => window.TravisRichText ? TravisRichText.render(node, text) : (node.textContent = text);
    const run = ++typing;
    if (reduced || !text) { complete(); scrollLog(); if (run === typing) mood(null); return Promise.resolve(); }
    mood('talking');
    const parts = text.split(/(\s+)/);
    const words = parts.filter((w) => w.trim()).length || 1;
    const per = Math.min(PACE.word, PACE.maxStream / words);   // long replies stream faster
    const caret = el('span', { class: 'caret', 'aria-hidden': 'true' });
    node.append(caret);
    return new Promise((resolve) => {
      let i = 0;
      const finish = () => { complete(); scrollLog(); if (run === typing) mood(null); resolve(); };
      node.addEventListener('click', () => { i = parts.length; }, { once: true });
      (function tick() {
        if (!node.isConnected) return resolve();
        if (i >= parts.length) return finish();
        const w = parts[i++];
        node.insertBefore(/^\s+$/.test(w) ? document.createTextNode(w) : el('span', { class: 'w', text: w }), caret);
        scrollLog();
        if (/^\s+$/.test(w)) return tick();
        setTimeout(tick, per);
      })();
    });
  }

  function say(text, opts = {}) {
    state.history.push({ role: 'assistant', content: text });
    const t = ensureTurn();
    const ready = pending;
    return ready.then(() => {
      const reply = el('div', { class: opts.welcome ? 'reply is-welcome' : 'reply' });
      t.append(reply);
      renderChips(opts.chips || []);
      return stream(reply, text);
    });
  }

  // The answer being written (streamed): its units in grey as they come, then replaced by the
  // verified answer (Michael, 2026-10-20: the visitor doesn't wait for the whole verification)
  function draft() {
    const node = el('div', { class: 'reply is-draft', 'aria-live': 'polite' });
    const note = el('p', { class: 'draft-state', text: UI().verifying });
    return {
      add(text) {
        if (!node.isConnected) { ensureTurn().append(node); node.append(note); mood('talking'); }
        node.insertBefore(el('p', { class: 'draft-unit', text }), note);
        scrollLog();
      },
      clear() { node.remove(); }
    };
  }

  // A tool-call card: Running… while fn runs (at least PACE.tool), then Done or Failed
  const TOOL = {
    open: (a) => ['open_project', DATA.projects[a.id] && DATA.projects[a.id].title],
    scroll: (a) => ['scroll_to', a.target],
    news: () => ['read_news', 'GitHub'],
    link: (a) => ['open_link', (a.url || '').replace(/^https:\/\//, '')],
    close: () => ['close_project', '']
  };
  function tool(name, arg, fn) {
    const stateEl = el('span', { class: 'tool-state', text: UI().toolRunning });
    const card = el('div', { class: 'tool is-running' }, [
      svg(BRACKETS, 'tool-icon'),
      el('span', { class: 'tool-name', text: name }),
      el('span', { class: 'tool-arg', text: arg || '' }),
      stateEl
    ]);
    ensureTurn().append(card);
    scrollLog();
    const job = (async () => {
      try {
        const [out] = await Promise.all([fn ? fn() : undefined, wait(PACE.tool)]);
        card.classList.replace('is-running', 'is-done');
        stateEl.textContent = UI().toolDone;
        await wait(PACE.afterTool);
        return out;
      } catch (e) {
        card.classList.replace('is-running', 'is-failed');
        stateEl.textContent = UI().toolFail;
        throw e;
      }
    })();
    pending = Promise.all([pending, job.catch(() => {})]);
    return job;
  }

  /* ── welcome → conversation ──────────────────────────── */
  // From the first question the avatar shrinks and the chat slides along (CSS)
  function engage() {
    if (state.chatting) return;
    state.chatting = true;
    document.body.classList.add('is-chatting');
  }

  // "Listening" while the visitor types
  function listen(on) {
    document.body.classList.toggle('is-listening', on);
    if (!document.body.classList.contains('is-talking') && !document.body.classList.contains('is-thinking')) mood(null);
  }

  function userSays(text) {
    state.history.push({ role: 'user', content: text });
    turn = null;
    log.append(el('p', { class: 'msg-user', text }));
    scrollLog();
  }

  // The welcome: Travis's greeting alone (ØMYSTIK has its entry in the menu)
  function welcome() { return say(UI().t.hello, { welcome: true }); }

  /* ── the menu "::" ───────────────────────────────────── */
  const menuBtn = $('#menu-btn'), menuPanel = $('#menu-panel');
  function toggleMenu(open) {
    const show = open === undefined ? menuPanel.hidden : open;
    menuPanel.hidden = !show;
    menuBtn.setAttribute('aria-expanded', String(show));
    if (!show) toggleDropdown(null);
  }
  // New chat: the conversation is forgotten (it was only in memory) and Travis greets again
  function newChat() {
    toggleMenu(false);
    if (state.busy) return;
    if (state.openId) closeStage();
    log.replaceChildren(); state.history = []; turn = null;
    state.chatting = false;
    document.body.classList.remove('is-chatting');
    renderChips([]);
    welcome();
    $('#ask-input').focus();
  }
  // Back to the chat: the open project closes, the question field takes the focus
  function backToChat() {
    toggleMenu(false);
    if (state.openId) closeStage();
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    $('#ask-input').focus();
  }
  // The glass bar (projects, latest, technology, languages) and the language live in the menu;
  // on phones the links (GitHub, LinkedIn, Discord) and the footer join them
  const phone = window.matchMedia('(max-width: 900px)');
  // (in the menu's order: projects and the glass bar, the links, the language, the footer)
  // FR / EN stays in the top bar, on the right, on every screen (Michael, 2026-10-20)
  const movable = [['.glassnav', true], ['.socials', false], ['.footer', false]].map(([sel, always]) => {
    const n = document.querySelector(sel); return { n, always, parent: n.parentNode, next: n.nextSibling };
  });
  function placeMenu() {
    for (const m of movable) {
      if (m.always || phone.matches) $('#menu-more').append(m.n);
      else if (m.n.parentNode !== m.parent) m.parent.insertBefore(m.n, m.next && m.next.parentNode === m.parent ? m.next : null);
    }
  }

  function renderChips(items) {
    chipsBox.replaceChildren(...items.map((c) => el('button', {
      type: 'button', class: c.featured ? 'chip is-featured' : 'chip', text: c.label,
      onclick: () => (c.open ? pickProject(c.open, true) : ask(c.query, c.label))
    })));
  }

  async function ask(query, shown) {
    if (state.busy || !query) return;
    engage();
    state.busy = true;
    listen(false);
    renderChips([]);
    userSays(shown || query);
    think();
    try {
      // With the live model, its own response time is the thinking
      await wait(CFG.agentEndpoint ? 400 : PACE.thinking);
      await Travis.respond(query, state.history, {
        lang: state.lang, say, act, tool, draft,
        latestNews: () => (state.news[0] ? { ...state.news[0], text: newsText(state.news[0]) } : null)
      });
    } finally {
      if (thinking) { thinking.remove(); thinking = null; }
      state.busy = false;
      mood(null);
    }
  }

  /* ── actions Travis can take (each shown as a tool call) ── */
  function act(a) {
    if (!a || !TOOL[a.type]) return;
    if (a.type === 'open' && !DATA.projects[a.id]) return;
    if (a.type === 'link' && !/^https:\/\//.test(a.url || '')) return;
    const [name, arg] = TOOL[a.type](a);
    tool(name, arg);
    if (a.type === 'open') openProject(a.id);
    else if (a.type === 'close') closeStage();
    else if (a.type === 'scroll') { const t = document.getElementById(a.target); if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); }
    else if (a.type === 'news') toggleLatest(true);
    else if (a.type === 'link') window.open(a.url, '_blank', 'noopener');
  }

  function pickProject(id, announce, silentUser) {
    const p = DATA.projects[id];
    if (!p) return;
    engage();
    if (!announce) return openProject(id);
    if (silentUser) { state.history.push({ role: 'user', content: p.title }); turn = null; }
    else userSays(p.title);
    act({ type: 'open', id });
    say(`${UI().t.open(p.title)}\n${L(p.pitch)}`, { chips: Travis.chipsFor(state.lang, 'after') });
  }

  /* ── stage ───────────────────────────────────────────── */
  const stage = $('#stage');
  function openProject(id) {
    state.openId = id;
    renderProject(id);
    stage.hidden = false;
    document.body.classList.add('is-presenting');
    try { history.replaceState(null, '', '#/work/' + id); } catch (e) { /* ignore */ }
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  }
  function closeStage() {
    state.openId = null;
    stage.hidden = true;
    document.body.classList.remove('is-presenting');
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
    renderChips(Travis.chipsFor(state.lang, 'after'));
  }

  function renderProject(id) {
    const p = DATA.projects[id];
    const ui = UI();
    $('#stage-crumb').textContent = `${ui.work} / ${p.title}`;
    const media = (p.media || []).map((m) => {
      const image = m.type !== 'vimeo' && m.type !== 'pdf' && m.type !== 'video';
      // Images open in full size in a new tab (the original file when given, e.g. an SVG)
      const openHref = m.full || m.src;
      const cap = m.caption || image
        ? el('figcaption', {}, [
            m.caption ? L(m.caption) : null,
            image ? el('a', { class: 'media-open-link', href: openHref, target: '_blank', rel: 'noopener', text: ui.openFull }) : null
          ])
        : null;
      const empty = () => el('div', { class: 'media-empty', text: ui.noMedia });
      let node;
      if (m.type === 'vimeo') {
        // A Vimeo video: { type: 'vimeo', id: '123456789', hash?: 'abc…' (unlisted videos),
        //   square?: true (a square video, shown in a square frame), loop?: true (a short clip) }
        // dnt=1: Vimeo sets no tracking cookies for visitors. No id yet: placeholder.
        node = m.id
          ? el('iframe', {
              class: 'media-frame' + (m.square ? ' is-square' : ''),
              src: `https://player.vimeo.com/video/${encodeURIComponent(m.id)}?dnt=1&title=0&byline=0&portrait=0${m.loop ? '&loop=1' : ''}${m.hash ? '&h=' + encodeURIComponent(m.hash) : ''}`,
              title: L(m.caption) || p.title, loading: 'lazy',
              allow: 'autoplay; fullscreen; picture-in-picture', allowfullscreen: true
            })
          : empty();
      } else if (m.type === 'pdf') {
        // A document shown in the page, with a link when the browser can't display it
        node = el('object', { class: 'media-pdf', data: m.src + '#view=FitH', type: 'application/pdf' }, [
          el('a', { class: 'media-empty', href: m.src, target: '_blank', rel: 'noopener', text: L(m.caption) || m.src })
        ]);
      } else if (m.type === 'video') {
        node = el('video', { src: m.src, controls: true, muted: true, playsinline: true, preload: 'metadata' });
        node.addEventListener('error', () => node.replaceWith(empty()), { once: true });
      } else {
        const img = el('img', { src: m.src, alt: L(m.caption) || p.title, loading: 'lazy' });
        node = el('a', { class: 'media-open', href: openHref, target: '_blank', rel: 'noopener', 'aria-label': `${L(m.caption) || p.title} · ${ui.openFull}` }, [img]);
        img.addEventListener('error', () => node.replaceWith(empty()), { once: true });
      }
      // A Vimeo video's frame (border, caption) is as wide as the video, not the stage
      const fit = m.type === 'vimeo' && m.id ? (m.square ? ' is-square-video' : ' is-video') : '';
      return el('figure', { class: 'media' + fit }, [node, cap]);
    });
    const block = (k) => (p[k] ? el('div', { class: 'block' }, [el('h4', { text: ui[k] }), el('p', { text: L(p[k]) })]) : null);
    // replaceChildren() would write a missing part (null) as the text "null"
    $('#project').replaceChildren(...[
      el('h3', { text: p.title }),
      el('p', { class: 'pitch', text: L(p.pitch) }),
      el('ul', { class: 'tags', 'aria-label': 'Tags' }, [
        ...p.pillars.map((t) => el('li', { class: 'pillar', text: t })),
        p.year ? el('li', { text: p.year }) : null,
        ...p.stack.map((t) => el('li', { text: t }))
      ]),
      ...(media.length ? media : [el('figure', { class: 'media' }, [el('div', { class: 'media-empty', text: ui.noMedia })])]),
      el('div', { class: 'blocks' }, [block('problem'), block('approach'), block('result')]),
      p.lineage ? el('div', { class: 'lineage' }, [el('h4', { text: ui.lineage.toUpperCase() }), el('p', { text: L(p.lineage) })]) : null,
      el('ul', { class: 'links' }, p.links.map((l) => el('li', {}, [el('a', { href: l.url, target: '_blank', rel: 'noopener', text: l.label })])))
    ].filter(Boolean));
  }

  /* ── Glass bar dropdowns: LATEST and PATH ─────────────── */
  // One open at a time; Escape or a click outside closes it
  const dropdowns = [...document.querySelectorAll('.dd-trigger')].map((btn) => ({
    btn, panel: document.getElementById(btn.getAttribute('aria-controls'))
  }));
  function toggleDropdown(id, open) {
    for (const d of dropdowns) {
      const show = d.panel.id === id ? (open === undefined ? d.panel.hidden : open) : false;
      d.panel.hidden = !show;
      d.btn.setAttribute('aria-expanded', String(show));
    }
  }
  const toggleLatest = (open) => toggleDropdown('latest-panel', open);
  dropdowns.forEach((d) => d.btn.addEventListener('click', () => toggleDropdown(d.panel.id)));
  document.addEventListener('click', (e) => { if (!e.target.closest('.glassnav')) toggleDropdown(null); });   // (inside the menu too)
  // Escape closes the open dropdown only (not an open project behind it)
  document.addEventListener('keydown', (e) => {
    const open = dropdowns.find((d) => !d.panel.hidden);
    if (e.key !== 'Escape' || !open) return;
    e.stopImmediatePropagation();
    toggleDropdown(null);
    open.btn.focus();
  });

  /* ── THEMES / LANGUAGES ─────────────────────────────────── */
  // Each entry asks Travis, who lists its projects and offers to open them
  function renderTopics() {
    const list = (sel, items) => $(sel).replaceChildren(...items.map((t) => {
      const label = L(t.label);
      return el('li', {}, [el('button', {
        type: 'button', class: 'topic',
        onclick: () => { toggleDropdown(null); showTopic(label, t.projects); }
      }, [el('span', { text: label }), el('span', { class: 'topic-count', text: String(t.projects.length) })])]);
    }));
    // ordered by number of projects, most first (Mike, 2026-10-19)
    const byCount = (items) => items.map((t, i) => ({ t, i })).sort((a, b) => b.t.projects.length - a.t.projects.length || a.i - b.i).map((x) => x.t);
    list('#themes-list', byCount(DATA.themes || []));
    list('#languages-list', byCount(DATA.languages || []));
    // Projects: by year, most recent first; training and unfinished work left out (Mike)
    const HIDDEN = ['udacity', 'airfoil'];
    const start = (id) => Number((String(DATA.projects[id].year || '').match(/\d{4}/) || [0])[0]);
    const order = [...new Set((DATA.groups || []).flatMap((g) => g.projects))];
    const ids = order.filter((id) => DATA.projects[id] && !HIDDEN.includes(id)).sort((a, b) => start(b) - start(a) || order.indexOf(a) - order.indexOf(b));
    $('#projects-list').replaceChildren(...ids.map((id) => el('li', {}, [el('button', {
      type: 'button', class: 'topic',
      onclick: () => { toggleDropdown(null); pickProject(id, true); }
    }, [el('span', { text: DATA.projects[id].title }), el('span', { class: 'topic-count', text: DATA.projects[id].year || '' })])])));
  }

  async function showTopic(label, ids) {
    if (state.busy) return;
    engage();
    state.busy = true;
    listen(false);
    renderChips([]);
    userSays(label);
    think();
    try {
      await wait(PACE.thinking);
      const known = ids.filter((id) => DATA.projects[id]);
      await say(UI().t.topic(label, known.map((id) => DATA.projects[id].title)), {
        chips: known.map((id) => ({ label: DATA.projects[id].title, open: id }))
      });
    } finally {
      if (thinking) { thinking.remove(); thinking = null; }
      state.busy = false;
      mood(null);
    }
  }

  /* ── PATH ──────────────────────────────────────────────── */

  /* ── NEWS: generated file first, live GitHub commits second ── */
  async function loadNews() {
    try {
      const res = await fetch(CFG.newsFile, { cache: 'no-cache' });
      if (res.ok) {
        const items = await res.json();
        if (Array.isArray(items) && items.length) {
          state.news = items.slice(0, CFG.newsCount).map((n) => ({ repo: n.repo, repoLabel: label(n.repo), date: n.date, textObj: n, url: n.url }));
          return;
        }
      }
    } catch (e) { /* no generated file yet (or file:// preview) */ }
    try {
      const lists = await Promise.all(CFG.newsRepos.map((r) => Travis.GitHub.commits(r, CFG.newsCount).catch(() => [])));
      state.news = lists.flat()
        .filter((c) => c.date && !/^merge\b/i.test(c.message))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, CFG.newsCount)
        .map((c) => ({ repo: c.repo, repoLabel: label(c.repo), date: c.date, text: c.message, url: c.url }));
    } catch (e) { state.news = []; }
  }
  function label(repo) { return repo === 'omystik/omystik' ? 'ømystik' : repo.split('/').pop(); }
  function newsText(n) { return n.textObj ? (n.textObj[state.lang] || n.textObj.en || '') : n.text; }

  function renderNews() {
    const list = $('#news-list');
    if (!state.news.length) { list.replaceChildren(el('li', { class: 'news-empty', text: UI().newsEmpty })); return; }
    list.replaceChildren(...state.news.map((n) => el('li', {}, [
      el('a', { class: 'news-item', href: n.url || '#', target: '_blank', rel: 'noopener' }, [
        el('span', { class: 'repo', text: n.repoLabel }),
        el('span', { class: 'text', text: newsText(n) }),
        el('span', { class: 'when', text: Travis.relTime(n.date, state.lang) })
      ])
    ])));
  }

  /* ── boot ────────────────────────────────────────────── */
  async function boot() {
    $('#year').textContent = new Date().getFullYear();
    setupContact();
    applyLang();

    document.querySelectorAll('.lang button').forEach((b) => b.addEventListener('click', () => setLang(b.dataset.lang)));
    // Clicking Travis puts the cursor in the question field
    $('#avatar-btn').addEventListener('click', () => $('#ask-input').focus());
    const input = $('#ask-input');
    const form = $('#ask');
    // On the landing page the field is as wide as its text, the placeholder when empty (Mike,
    // 2026-10-20: the empty bubble was too long); once chatting it takes the full width
    const ruler = document.createElement('canvas').getContext('2d');
    const fitWidth = () => {
      if (document.body.classList.contains('is-chatting') || document.body.classList.contains('is-presenting')) { form.style.removeProperty('--ask-fit'); return; }
      const cs = getComputedStyle(input);
      let size = cs.fontSize;
      if (!input.value) { try { size = getComputedStyle(input, '::placeholder').fontSize || size; } catch (e) { /* the field's size */ } }
      ruler.font = `${cs.fontWeight} ${size} ${cs.fontFamily}`;
      const text = Math.max(...(input.value || input.placeholder).split('\n').map((l) => ruler.measureText(l).width));
      const fs = getComputedStyle(form), send = form.querySelector('.send');
      const frame = ['paddingLeft', 'paddingRight', 'borderLeftWidth', 'borderRightWidth'].reduce((n, k) => n + parseFloat(fs[k] || 0), 0)
        + (parseFloat(fs.columnGap) || 0) + (send ? send.offsetWidth : 44) + 6;
      form.style.setProperty('--ask-fit', Math.ceil(text + frame) + 'px');
    };
    // The field grows with its text (and fits the whole placeholder when empty)
    const fit = () => {
      fitWidth();
      const empty = !input.value;
      if (empty) input.value = input.placeholder;
      input.style.height = 'auto';
      input.style.height = input.scrollHeight + 'px';
      if (empty) input.value = '';
      form.classList.toggle('is-empty', !input.value.trim());
    };
    input.addEventListener('input', () => { fit(); listen(input.value.trim().length > 0); });
    // the width changes with the page's state and the font once it has loaded (the screen: below)
    new MutationObserver(fit).observe(document.body, { attributes: true, attributeFilter: ['class'] });
    if (document.fonts) document.fonts.ready.then(fit);
    input.addEventListener('blur', () => listen(false));
    // Enter sends, Shift+Enter starts a new line
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
    });
    window.addEventListener('resize', fit);
    fit();
    $('#stage-close').addEventListener('click', closeStage);
    menuBtn.addEventListener('click', () => toggleMenu());
    // GitHub: a small menu of the three accounts; a click outside or Escape closes it
    const ghBtn = $('#gh-btn'), ghPanel = $('#gh-panel');
    const toggleGh = (open) => { const show = open === undefined ? ghPanel.hidden : open; ghPanel.hidden = !show; ghBtn.setAttribute('aria-expanded', String(show)); };
    ghBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleGh(); });
    ghPanel.addEventListener('click', (e) => { if (e.target.closest('a')) toggleGh(false); });
    document.addEventListener('click', (e) => { if (!ghPanel.hidden && !e.target.closest('.gh')) toggleGh(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !ghPanel.hidden) { e.stopImmediatePropagation(); toggleGh(false); ghBtn.focus(); } }, true);
    $('#menu-new').addEventListener('click', newChat);
    $('#menu-back').addEventListener('click', backToChat);
    // Discover ØMYSTIK opens omystik.org (a link: the menu closes like on any link)
    // a link or a topic picked inside the menu closes it; a click outside closes it
    menuPanel.addEventListener('click', (e) => { if (e.target.closest('a, .topic')) toggleMenu(false); });
    document.addEventListener('click', (e) => { if (!menuPanel.hidden && !e.target.closest('.menu')) toggleMenu(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menuPanel.hidden) { e.stopImmediatePropagation(); toggleMenu(false); menuBtn.focus(); } }, true);
    placeMenu();
    phone.addEventListener('change', placeMenu);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && state.openId) closeStage(); });
    $('#ask').addEventListener('submit', (e) => {
      e.preventDefault();
      const input = $('#ask-input');
      const q = input.value.trim();
      if (!q) return;
      input.value = '';
      input.dispatchEvent(new Event('input'));
      ask(q);
    });

    const deep = (location.hash.match(/^#\/work\/([\w-]+)/) || [])[1];
    loadNews().then(renderNews);

    if (deep && DATA.projects[deep]) return pickProject(deep, true, true);
    // The welcome bubble opens and writes itself (Travis turns to dots meanwhile)
    await wait(700);
    welcome();
  }

  boot();
})();
