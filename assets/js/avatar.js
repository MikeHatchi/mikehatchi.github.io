/* travis::iv — Travis's avatar.
   At rest it is the image itself. When Travis thinks or talks, the image turns
   into a dense field of white dots that move; when he stops, the dots settle
   back into place and the image returns. On page load the dots gather into
   the face, then become the image.
   Reduced motion: the image only, nothing moves. */
(function () {
  const FACE = 0.76;         // the silhouette's longest side, as a share of the circle
  const STEP = 1.5;          // sampling grid on screen, in CSS px: smaller = denser face
  const DOT = 1.6;           // dot size on screen, in CSS px
  const COLOR = '#FFFFFF';   // as white as the image
  // Each dot has a soft halo, and light adds up where dots meet: the field glows (Mike,
  // 2026-10-20: the dots must be white and much brighter). HALO: its size, as a multiple of a dot
  const HALO = 3, HALO_ALPHA = 0.18;
  const FADE = 260;          // ms to cross-fade between image and dots
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // How the dots move while Travis is busy.
  // ring: thinking pushes the dots away from the centre of the face, as a touch
  // there would, so they gather into a circle. Its radius, as a share of the
  // canvas; band: the circle's thickness, as a share of that radius.
  const MOTION = {
    thinking: { drift: 0.41, speed: 0.002, wave: 3, ring: 0.3, band: 0.2 },
    talking: { drift: 0.85, speed: 0.0045, wave: 0 }
  };

  function mount(img) {
    // The avatar's size is set in CSS only (.avatar in style.css). It is drawn at
    // the size it is shown at when the page opens, its largest. Never below 300 px,
    // so a page opened on a small state (a project link) stays sharp when it grows.
    const SIZE = Math.max(300, Math.round(img.getBoundingClientRect().width || 0));
    const canvas = document.createElement('canvas');
    canvas.className = img.className;
    canvas.setAttribute('aria-hidden', 'true');
    canvas.width = canvas.height = Math.round(SIZE * Math.min(window.devicePixelRatio || 1, 2));
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.scale(canvas.width / SIZE, canvas.height / SIZE);

    const source = new Image();
    source.src = img.currentSrc || img.src;

    // The canvas is drawn at SIZE but shown at its CSS size (smaller on phones):
    // keep the same spacing on screen, so a smaller avatar needs fewer dots
    const shown = img.getBoundingClientRect().width || SIZE;
    const grid = Math.max(STEP, (STEP * SIZE) / shown);
    const dot = (DOT * grid) / STEP;

    let face = null;         // where the image is drawn: x, y, w, h
    let particles = [];
    let motion = null;       // MOTION entry while busy, null at rest
    let blend = 1;           // 0 = image, 1 = dots
    let fading = null;       // { from, to, start }
    let running = false;
    let calm = false;        // the circle: glide in and out, no bounce

    // Fit the silhouette (its opaque pixels) to the circle, centred
    function fit() {
      const off = document.createElement('canvas');
      off.width = off.height = SIZE;
      const o = off.getContext('2d', { willReadFrequently: true });
      o.drawImage(source, 0, 0, SIZE, SIZE);
      const px = o.getImageData(0, 0, SIZE, SIZE).data;
      let x0 = SIZE, y0 = SIZE, x1 = 0, y1 = 0;
      for (let y = 0; y < SIZE; y++) {
        for (let x = 0; x < SIZE; x++) {
          if (px[(y * SIZE + x) * 4 + 3] < 128) continue;
          if (x < x0) x0 = x; if (x > x1) x1 = x;
          if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
      }
      const bw = x1 - x0 + 1;
      const bh = y1 - y0 + 1;
      const k = (SIZE * FACE) / Math.max(bw, bh);
      face = { x: SIZE / 2 - (x0 + bw / 2) * k, y: SIZE / 2 - (y0 + bh / 2) * k, w: SIZE * k, h: SIZE * k };

      // One dot per grid cell covered by the image, at the same place
      o.clearRect(0, 0, SIZE, SIZE);
      o.drawImage(source, face.x, face.y, face.w, face.h);
      const data = o.getImageData(0, 0, SIZE, SIZE).data;
      const list = [];
      for (let y = 0; y < SIZE; y += grid) {
        for (let x = 0; x < SIZE; x += grid) {
          if (data[(Math.floor(y) * SIZE + Math.floor(x)) * 4 + 3] < 128) continue;
          list.push({ hx: x, hy: y, x, y, vx: 0, vy: 0, ph: Math.random() * Math.PI * 2 });
        }
      }
      return list;
    }

    function draw() {
      ctx.clearRect(0, 0, SIZE, SIZE);
      if (blend < 1) {
        ctx.globalAlpha = 1 - blend;
        ctx.drawImage(source, face.x, face.y, face.w, face.h);
      }
      if (blend > 0) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = COLOR;
        const h = dot * HALO, o = (h - dot) / 2;
        ctx.globalAlpha = blend * HALO_ALPHA;
        for (const p of particles) ctx.fillRect(p.x - o, p.y - o, h, h);
        ctx.globalAlpha = blend;
        for (const p of particles) ctx.fillRect(p.x, p.y, dot, dot);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalAlpha = 1;
    }

    function fadeTo(to, now) {
      if (blend === to || (fading && fading.to === to)) return;
      fading = { from: blend, to, start: now };
    }

    function frame(t) {
      if (!running) return;
      const m = motion;
      const c = SIZE / 2;
      const r = m && m.ring ? SIZE * m.ring : 0;
      // Spring: the default one bounces a little (the intro, talking); the calm
      // one glides without overshoot, so the circle forms and undoes smoothly
      const pull = calm ? 0.05 : 0.07;
      const damp = calm ? 0.65 : 0.84;
      let settled = true;
      for (const p of particles) {
        let tx = p.hx;
        let ty = p.hy;
        if (r) {
          // Dots inside the circle move out to its edge, keeping their direction
          // from the centre: the nearer the centre, the closer to the inner edge
          const dx = p.hx - c;
          const dy = p.hy - c;
          const d = Math.hypot(dx, dy);
          if (d < r) {
            const a = d > 0.5 ? Math.atan2(dy, dx) : p.ph;
            const to = r + (d / r) * r * m.band;
            tx = c + Math.cos(a) * to;
            ty = c + Math.sin(a) * to;
          }
        }
        if (m) {
          tx += Math.sin(t * m.speed + p.ph) * m.drift;
          ty += Math.cos(t * m.speed * 1.3 + p.ph) * m.drift;
          if (m.wave) tx += Math.sin(t * 0.004 - p.hy * 0.06) * m.wave;
        }
        p.vx = (p.vx + (tx - p.x) * pull) * damp;
        p.vy = (p.vy + (ty - p.y) * pull) * damp;
        p.x += p.vx;
        p.y += p.vy;
        if (settled && (Math.abs(p.x - p.hx) > 0.35 || Math.abs(p.y - p.hy) > 0.35)) settled = false;
      }
      // Back at rest and every dot home: become the image again
      if (!m && settled) { fadeTo(0, t); calm = false; }
      if (fading) {
        const k = Math.min(1, (t - fading.start) / FADE);
        blend = fading.from + (fading.to - fading.from) * k;
        if (k === 1) fading = null;
      }
      draw();
      if (!m && blend === 0 && !fading) { running = false; return; }   // at rest: nothing to animate
      requestAnimationFrame(frame);
    }

    function wake() {
      if (running || reduced || document.hidden || !particles.length) return;
      running = true;
      requestAnimationFrame(frame);
    }

    // The image's load event (decode() can stay pending while a page is hidden)
    const loaded = new Promise((resolve, reject) => {
      source.onload = resolve;
      source.onerror = reject;
      if (source.complete && source.naturalWidth) resolve();
    });
    loaded.then(() => {
      particles = fit();
      img.replaceWith(canvas);
      if (reduced) { blend = 0; draw(); return; }
      // Intro: the dots start scattered around the circle and gather into the face
      for (const p of particles) {
        const a = Math.random() * Math.PI * 2;
        const r = SIZE * (0.3 + Math.random() * 0.4);
        p.x = SIZE / 2 + Math.cos(a) * r;
        p.y = SIZE / 2 + Math.sin(a) * r;
      }
      draw();
      wake();
    }).catch(() => { /* keep the <img> if the image can't be read */ });

    document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });

    return {
      setMood(name) {
        motion = MOTION[name] || null;
        if (motion && motion.ring) calm = true;
        if (!particles.length || reduced) return;
        if (motion) fadeTo(1, performance.now());
        wake();
      }
    };
  }

  const img = document.querySelector('img.avatar');
  const fx = img ? mount(img) : null;
  window.TravisAvatar = { setMood: (m) => fx && fx.setMood(m) };
})();
