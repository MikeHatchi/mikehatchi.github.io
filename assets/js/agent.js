/* travis::iv — Travis's brain.
   Two modes:
   - remote: if TRAVIS_CONFIG.agentEndpoint is set, questions go to the live model (via the Worker).
   - local:  otherwise Travis answers from data.js and reads GitHub live. Also the fallback when remote fails. */
(function () {
  const CFG = window.TRAVIS_CONFIG;
  const DATA = window.TRAVIS_DATA;
  const I18N = window.TRAVIS_I18N;

  /* ── GitHub (public API, no key, cached per tab) ─────────── */
  const GitHub = {
    async commits(repo, n = 5) {
      const key = 'gh:' + repo + ':' + n;
      try {
        const hit = JSON.parse(sessionStorage.getItem(key) || 'null');
        if (hit && Date.now() - hit.t < 10 * 60 * 1000) return hit.v;
      } catch (e) { /* storage unavailable */ }
      const res = await fetch(`https://api.github.com/repos/${repo}/commits?per_page=${n}`, {
        headers: { Accept: 'application/vnd.github+json' }
      });
      if (!res.ok) throw new Error('GitHub ' + res.status);
      const json = await res.json();
      const v = json.map((c) => ({
        repo,
        sha: c.sha,
        date: c.commit && (c.commit.committer || c.commit.author) ? (c.commit.committer || c.commit.author).date : null,
        message: c.commit ? String(c.commit.message || '').split('\n')[0] : '',
        url: c.html_url
      }));
      try { sessionStorage.setItem(key, JSON.stringify({ t: Date.now(), v })); } catch (e) { /* ignore */ }
      return v;
    }
  };

  function relTime(iso, lang) {
    if (!iso) return '';
    const diff = (new Date(iso).getTime() - Date.now()) / 1000;
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: 'auto' });
    const steps = [['year', 31536000], ['month', 2592000], ['week', 604800], ['day', 86400], ['hour', 3600], ['minute', 60]];
    for (const [unit, sec] of steps) {
      if (Math.abs(diff) >= sec) return rtf.format(Math.round(diff / sec), unit);
    }
    return rtf.format(0, 'minute');
  }

  function clip(s, n) { s = String(s || ''); return s.length > n ? s.slice(0, n - 1) + '…' : s; }

  /* ── text matching ───────────────────────────────────────── */
  function norm(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ø/g, 'o');
  }
  function has(text, kw) {
    const k = norm(kw);
    if (k.length <= 3) return new RegExp('(^|[^a-z0-9])' + k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^a-z0-9]|$)').test(text);
    return text.includes(k);
  }
  const any = (text, list) => list.some((k) => has(text, k));

  const KW = {
    greet: ['hi', 'hello', 'hey', 'bonjour', 'salut', 'coucou', 'yo'],
    thanks: ['thanks', 'thank you', 'merci', 'cool', 'great', 'super', 'parfait'],
    news: ['new', 'news', 'latest', 'update', 'recent', 'commit', 'push', 'changed', 'this week', 'quoi de neuf', 'nouveau', 'nouveaute', 'dernier', 'derniere', 'recemment', 'mise a jour', 'cette semaine'],
    contact: ['contact', 'email', 'e-mail', 'mail', 'linkedin', 'reach', 'joindre', 'contacter', 'ecrire'],
    hire: ['hire', 'hiring', 'job', 'position', 'available', 'recruit', 'cv', 'resume', 'poste', 'emploi', 'recrut', 'embauche', 'disponible', 'candidat'],
    who: ['who', 'mike', 'about', 'background', 'yourself', 'qui', 'presente', 'parcours', 'profil', 'biograph'],
    vrona: ['vrona', 'company', 'societe', 'entreprise', 'founder', 'fondateur', 'solopreneur'],
    stack: ['stack', 'language', 'langage', 'langue de prog', 'technolog', 'tools', 'outils', 'framework', 'rust', 'python', 'pytorch', 'solidity'],
    fhe: ['fhe', 'homomorph', 'confidential', 'confidentiel', 'encrypt', 'chiffr', 'crypt', 'privacy', 'vie privee', 'secure', 'securite', 'tfhe', 'zama'],
    ml: ['ml', 'machine learning', 'deep learning', 'deep', 'ai', 'ia', 'neural', 'neurone', 'model', 'modele', 'vision', 'reinforcement', 'renforcement', 'apprentissage'],
    dist: ['distributed', 'distribue', 'decentral', 'p2p', 'peer', 'pair-a-pair', 'blockchain', 'mesh', 'maillage'],
    projects: ['project', 'projet', 'portfolio', 'work', 'travaux', 'all', 'tous', 'everything', 'tout', 'list', 'liste'],
    path: ['path', 'parcours', 'timeline', 'chronolog', 'career', 'carriere', 'journey', 'year by year', 'annee par annee', 'history', 'historique']
  };

  function findProject(text) {
    let best = null; let score = 0;
    for (const [id, p] of Object.entries(DATA.projects)) {
      let s = 0;
      if (has(text, p.title)) s += 3;
      for (const k of p.keywords || []) if (has(text, k)) s += 1;
      if (s > score) { score = s; best = id; }
    }
    return score > 0 ? best : null;
  }

  function findLiveRepo(text) {
    for (const [name, repo] of Object.entries(CFG.liveRepos || {})) if (has(text, name)) return repo;
    return null;
  }

  /* ── chip sets ───────────────────────────────────────────── */
  function chipsFor(lang, which) {
    const sets = {
      // No generic topic buttons: only choices that answer one of Travis's questions
      home: [],
      fhe: [{ label: 'ømystik', open: 'omystik' }, { label: 'FHE.IRM', open: 'fhe-irm' }, { label: 'FHE.Chess', open: 'fhe-chess' }],
      ml: [{ label: 'BOT88', open: 'bot88' }, { label: 'ODetection', open: 'odetection' }, { label: 'F1Cars', open: 'f1cars' }],
      dist: [{ label: 'ømystik', open: 'omystik' }, { label: 'MYSTIK>p2p', open: 'mystik-p2p' }, { label: 'MetaHackers', open: 'metahackers' }],
      after: []
    };
    return sets[which] || sets.home;
  }

  /* ── local brain ─────────────────────────────────────────── */
  async function local(input, ctx) {
    const { lang, say, act } = ctx;
    const T = I18N[lang].t;
    const text = norm(input);
    const L = (o) => (o && typeof o === 'object' ? o[lang] : o);
    const profile = { bio: L(DATA.profile.bio), looking: L(DATA.profile.looking) };

    // 1. live "what's new in <repo>"
    const liveRepo = findLiveRepo(text);
    if (any(text, KW.news)) {
      if (liveRepo) {
        try {
          // Shown in the chat as a tool call: github.commits <repo> … DONE
          const list = await ctx.tool('github.commits', liveRepo, () => GitHub.commits(liveRepo, 5));
          const items = list.map((c) => `• ${relTime(c.date, lang)} · ${clip(c.message, 90)}`).join('\n');
          return say(T.liveResult(liveRepo, items), { chips: chipsFor(lang, 'after') });
        } catch (e) {
          return say(T.liveFail(liveRepo), { chips: chipsFor(lang, 'after') });
        }
      }
      act({ type: 'news' });
      const n = ctx.latestNews();
      return say(n ? T.newsLead(n.repoLabel, relTime(n.date, lang), clip(n.text, 110)) : T.noNewsLead, { chips: chipsFor(lang, 'after') });
    }

    // 2. short social turns
    if (text.length < 24 && any(text, KW.thanks)) return say(T.thanks, { chips: chipsFor(lang, 'after') });
    if (text.length < 20 && any(text, KW.greet)) return say(T.greet, { chips: chipsFor(lang, 'home') });

    // 3. intents about Mike
    if (any(text, KW.contact)) return say(T.contact(CFG.contact || {}), { chips: chipsFor(lang, 'after') });
    if (any(text, KW.hire)) return say(T.hire(profile), { chips: chipsFor(lang, 'fhe') });
    if (any(text, KW.vrona)) return say(T.vrona, { chips: chipsFor(lang, 'after') });
    // His path, year by year: the timeline, now that it is no longer a menu
    if (any(text, KW.path)) return say(T.path(DATA.timeline.map((t) => `${t.year} · ${L(t.text)}`).join('\n')), { chips: chipsFor(lang, 'after') });

    // 4. a named project
    const pid = findProject(text);
    if (pid) {
      act({ type: 'open', id: pid });
      const p = DATA.projects[pid];
      return say(`${T.open(p.title)}\n${L(p.pitch)}`, { chips: chipsFor(lang, 'after') });
    }

    // 5. topics
    if (any(text, KW.stack)) return say(T.stack, { chips: chipsFor(lang, 'after') });
    if (any(text, KW.fhe)) return say(T.fhe, { chips: chipsFor(lang, 'fhe') });
    if (any(text, KW.ml)) return say(T.ml, { chips: chipsFor(lang, 'ml') });
    if (any(text, KW.dist)) return say(T.dist, { chips: chipsFor(lang, 'dist') });
    if (any(text, KW.who)) return say(T.who(profile), { chips: chipsFor(lang, 'after') });
    if (any(text, KW.projects)) return say(T.projects, { chips: chipsFor(lang, 'after') });

    // 6. don't know
    return say(T.fallback, { chips: chipsFor(lang, 'home') });
  }

  /* ── remote brain (live model through the Worker) ───────── */
  async function remote(history, ctx) {
    // Shown in the chat as a tool call: model_computing Workers AI … DONE (or FAILED, and
    // local mode answers). No answer within CFG.agentTimeoutMs (the Worker's response
    // window plus a margin): it counts as failed.
    // Streamed: the Worker sends one JSON line per event; the units come in grey as they are
    // written, the verified answer replaces them. Silence for CFG.agentTimeoutMs, or more than
    // 95 s in all, counts as failed.
    const d = ctx.draft ? ctx.draft() : null;
    const out = await ctx.tool('model_computing', 'Workers AI', async () => {
      const ctrl = new AbortController();
      let timer = setTimeout(() => ctrl.abort(), CFG.agentTimeoutMs || 20000);
      const alive = () => { clearTimeout(timer); timer = setTimeout(() => ctrl.abort(), CFG.agentTimeoutMs || 20000); };
      const cap = setTimeout(() => ctrl.abort(), 95000);
      try {
        const res = await fetch(CFG.agentEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history.slice(-12), lang: ctx.lang, stream: Boolean(d) }),
          signal: ctrl.signal
        });
        if (!res.ok) throw new Error('agent ' + res.status);
        let json;
        if (d && /ndjson/.test(res.headers.get('Content-Type') || '')) {
          const reader = res.body.getReader(), dec = new TextDecoder();
          let buffer = '';
          for (;;) {
            const { value, done } = await reader.read();
            if (done) break;
            alive();
            buffer += dec.decode(value, { stream: true });
            let i;
            while ((i = buffer.indexOf('\n')) >= 0) {
              const line = buffer.slice(0, i).trim(); buffer = buffer.slice(i + 1);
              if (!line) continue;
              let e; try { e = JSON.parse(line); } catch (err) { continue; }
              if (e.type === 'unit' && typeof e.text === 'string') d.add(e.text);
              else if (e.type === 'final') json = e;
            }
          }
        } else json = await res.json();
        if (!json || typeof json.text !== 'string' || !json.text.trim()) throw new Error('agent empty');
        return json;
      } finally {
        clearTimeout(timer); clearTimeout(cap);
      }
    }).finally(() => { if (d) d.clear(); });
    for (const a of out.actions || []) ctx.act(a);
    return ctx.say(String(out.text || ''), { chips: out.chips || chipsFor(ctx.lang, 'after') });
  }

  async function respond(input, history, ctx) {
    if (CFG.agentEndpoint) {
      try { return await remote(history, ctx); } catch (e) { /* fall back to local */ }
    }
    return local(input, ctx);
  }

  window.Travis = { respond, chipsFor, GitHub, relTime, clip };
})();
