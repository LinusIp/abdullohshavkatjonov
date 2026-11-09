/*! seasons-motion.js — ambient seasonal motion for the home hero.
 * Reference implementation of docs/motion/measured-drift-plate.png and
 * docs/motion/measured-drift-philosophy.md. Vanilla JS, no dependencies.
 *
 * Usage:
 *   const m = SeasonMotion.start(hostElement, {
 *     season: 'winter',            // 'winter' | 'spring' | 'summer' | 'autumn'
 *     colors: { ink, halo, bg },   // optional; otherwise read from CSS vars
 *     avoid: [elements],           // particles fade to 15 % behind these (text)
 *     rest: element,               // autumn leaves may come to rest on its top edge
 *     trace: false                 // chronophotograph debug view (?motion=trace)
 *   });
 *   m.setSeason('spring'); m.pause(); m.play(); m.destroy(); m.stats();
 *   SeasonMotion.moment(season, { ticks, today });  // one-off year-line moment
 *
 * CSS variables read when `colors` is not given (define them per season):
 *   --motion-ink   particle colour (the season's link tone)
 *   --motion-halo  summer halo colour
 *   --motion-bg    page background (used for the leaf midrib)
 */
(function (root) {
  'use strict';

  var TAU = Math.PI * 2, DEG = Math.PI / 180;
  var sin = Math.sin, cos = Math.cos, min = Math.min, max = Math.max, abs = Math.abs;

  // ---------------------------------------------------------------- tuning
  // Every number below is charted on the plate. Change them there first.
  var DEPTH_SHARE = [0.35, 0.40, 0.25];   // far / mid / near
  var DEPTH_WIND = [0.70, 0.85, 1.00];
  var PREWARM = 60;                       // s simulated before the first frame
  var PAGE_FADE = 1.2;                    // s, whole canvas fades in
  var REF_AREA = 2560 * 960;              // field size the counts were tuned for (site: was 1100 * 460; see PR)
  var AVOID_FLOOR = 0.15, AVOID_FEATHER = 24;
  var DT_MAX = 0.05;                      // s, clamp after long frames
  var TRACE_DT = 0.75, TRACE_WIN = 24;    // plate exposure interval and window

  // One gust field shared by every particle (px of extra displacement).
  function wind(t) { return 12 * sin(TAU * t / 21 + 0.6) + 7 * sin(TAU * t / 34 + 2.1); }

  function mulberry32(a) {
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      var r = Math.imul(a ^ (a >>> 15), 1 | a);
      r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
      return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
  }

  function jit(R) { return 0.92 + 0.16 * R(); }
  function smooth01(x) { x = min(1, max(0, x)); return 1 - Math.pow(1 - x, 3); }

  // ---------------------------------------------------------------- seasons
  var SEASONS = {
    winter: {
      count: [12, 7],
      period: function (F) { return (F.h + 24) / 17; },
      init: function (p, R, F, S) {
        var d = p.d;
        p.R = [2.8, 3.8, 5.0][d] * jit(R);
        p.v = [13, 17, 22][d] * jit(R);
        p.A = (6 + 8 * R()) * [0.70, 0.85, 1.00][d]; p.T = 5 + 4 * R(); p.ph = TAU * R();
        p.A2 = 2.5 + 2.5 * R(); p.T2 = 17 + 6 * R(); p.ph2 = TAU * R();
        p.u = (2 + 2 * R()) * F.dir;
        p.spin = (4 + 6 * R()) * (R() < 0.5 ? -1 : 1) * DEG; p.r0 = 60 * R() * DEG;
        p.al = [0.60, 0.78, 0.94][d];
        p.x0 = S.pickX(-0.06, 1.06); p.y0 = -p.R - 6;
      },
      state: function (p, t, F) {
        var tau = t - p.ts, y = p.y0 + p.v * tau, end = F.h + p.R + 4;
        if (y > end) return false;
        p.x = p.x0 + p.u * tau + p.A * sin(TAU * tau / p.T + p.ph)
          + p.A2 * sin(TAU * tau / p.T2 + p.ph2) + wind(t) * DEPTH_WIND[p.d] * F.dir;
        p.y = y; p.rot = p.r0 + p.spin * tau; p.sx = 1;
        var e = min(1, tau / 1.2);
        if (y > 0.85 * F.h) e *= max(0, (end - y) / (end - 0.85 * F.h));
        p.a = p.al * e;
        return true;
      }
    },

    spring: {
      count: [10, 6],
      period: function (F) { return (F.w + 28) / 19; },
      init: function (p, R, F, S) {
        var d = p.d;
        p.L = [7, 9, 11.5][d] * jit(R);
        p.u = [14, 19, 24][d] * jit(R);
        p.vs = 2 + 3 * R();
        p.B = 10 + 12 * R(); p.Ty = 6 + 4 * R(); p.ph = TAU * R();
        p.Bx = 3 + 4 * R(); p.Tx = 9 + 4 * R(); p.phx = TAU * R();
        p.r0 = 8 + 8 * R(); p.Tr = 3 + 2 * R(); p.phr = TAU * R();
        p.al = [0.45, 0.68, 0.92][d];
        p.y0 = S.pickY(0.06, 0.90); p.x0 = F.dir > 0 ? -14 : F.w + 14;
      },
      state: function (p, t, F) {
        var tau = t - p.ts, span = F.w + 28;
        var dx = p.u * tau + p.Bx * sin(TAU * tau / p.Tx + p.phx);
        if (dx > span) return false;
        var y = p.y0 + p.vs * tau + p.B * sin(TAU * tau / p.Ty + p.ph);
        if (y > F.h + 20 || y < -20) return false;
        p.x = p.x0 + F.dir * dx + 0.6 * wind(t) * DEPTH_WIND[p.d] * F.dir;
        p.y = y; p.sx = 1;
        p.rot = (8 + p.r0 * sin(TAU * tau / p.Tr + p.phr)) * DEG * F.dir;
        var e = min(1, tau / 1.2), prog = dx / span;
        if (prog > 0.88) e *= max(0, (1 - prog) / 0.12);
        if (y > 0.9 * F.h) e *= max(0, (F.h + 20 - y) / (0.1 * F.h + 20));
        p.a = p.al * e;
        return true;
      }
    },

    summer: {
      count: [12, 7],
      period: function () { return 18; },
      init: function (p, R, F, S) {
        var d = p.d;
        p.r = [2.0, 2.8, 3.6][d] * jit(R);
        p.v = 4 + 4 * R(); p.life = 14 + 8 * R();
        p.A1 = 5 + 4 * R(); p.T1 = 11 + 6 * R(); p.p1 = TAU * R();
        p.A2 = 6 + 4 * R(); p.T2 = 23 + 8 * R(); p.p2 = TAU * R();
        p.Ay = 2 + 2 * R(); p.Ty = 9 + 6 * R(); p.py = TAU * R();
        p.Tp = 3 + 3 * R(); p.pp = TAU * R();
        p.al = [0.55, 0.75, 0.95][d];
        p.x0 = S.pickX(0.04, 0.96); p.y0 = S.pickY(0.18, 1.0);
      },
      state: function (p, t, F) {
        var tau = t - p.ts;
        if (tau > p.life) return false;
        var y = p.y0 - p.v * tau + p.Ay * sin(TAU * tau / p.Ty + p.py);
        if (y < -12) return false;
        p.x = p.x0 + p.A1 * sin(TAU * tau / p.T1 + p.p1) + p.A2 * sin(TAU * tau / p.T2 + p.p2)
          + 0.25 * wind(t) * F.dir;
        p.y = y; p.rot = 0; p.sx = 1;
        p.b = 0.10 + 0.90 * (0.5 + 0.5 * sin(TAU * tau / p.Tp + p.pp));
        var e = min(1, tau / 2) * min(1, (p.life - tau) / 2.5);
        if (y < 0.08 * F.h) e *= max(0, (y + 12) / (0.08 * F.h + 12));
        p.a = p.al * e;
        return true;
      }
    },

    autumn: {
      count: [8, 5],
      period: function (F) { return (F.h + 60) / 20; },
      init: function (p, R, F, S) {
        var d = p.d;
        p.L = [9, 11.5, 14][d] * jit(R);
        p.v = [16, 20, 24][d] * jit(R);
        p.th0 = (35 + 15 * R()) * DEG; p.Ts = 3.2 + 1.2 * R(); p.ph = TAU * R();
        p.arm = 26 + 14 * R();
        p.u = (0.5 + 2.5 * R()) * F.dir;
        p.Tm = 13 + 6 * R(); p.pm = TAU * R();
        p.base = ((R() < 0.5 ? -90 : 90) + 28 * R() - 14) * DEG;
        p.al = [0.48, 0.70, 0.92][d];
        p.x0 = S.pickX(0.04, 0.96); p.yp0 = -p.arm - p.L - 6;
        p.rest = null;
      },
      state: function (p, t, F, S) {
        var tau = t - p.ts;
        if (p.rest) return restState(p, t);
        var th = p.th0 * (1 + 0.12 * sin(TAU * tau / p.Tm + p.pm)) * sin(TAU * tau / p.Ts + p.ph);
        var y = p.yp0 + p.v * tau + p.arm * cos(th), end = F.h + p.L;
        if (y > end) return false;
        var x = p.x0 + p.u * tau + p.arm * sin(th) + wind(t) * DEPTH_WIND[p.d] * F.dir;
        var rot = p.base + 0.85 * th;
        var e = min(1, tau / 1.2);
        if (y > 0.88 * F.h) e *= max(0, (end - y) / (end - 0.88 * F.h));
        // Signature moment: now and then a leaf comes to rest on the year line.
        var L = S.rest;
        if (L && t >= S.nextLand && p.d > 0 && p.py !== undefined && p.py < L.y && y >= L.y - p.L * 0.2
            && x > L.x0 + 24 && x < L.x1 - 24 && e > 0.9) {
          S.nextLand = t + 25 + 15 * S.R();
          p.rest = { t0: t, x: x, y: y, rot: rot, sx: 0.6 + 0.4 * (1 - min(1, abs(th) / (1.12 * p.th0))),
            ty: L.y - p.L * 0.16, trot: (p.base > 0 ? 90 : -90) * DEG + (S.R() - 0.5) * 10 * DEG,
            stay: 3 + 2 * S.R(), a: p.al * e };
          return restState(p, t);
        }
        p.py = y;
        p.x = x; p.y = y; p.rot = rot; p.a = p.al * e;
        p.sx = 0.60 + 0.40 * (1 - min(1, abs(th) / (1.12 * p.th0)));
        return true;
      }
    }
  };

  // Critically damped settle (no bounce), then rest, then a 1.2 s fade.
  function restState(p, t) {
    var r = p.rest, s = t - r.t0;
    var k = 1 - (1 + 16 * s) * Math.exp(-16 * s);       // ~99 % settled at 0.4 s
    p.x = r.x; p.y = r.y + (r.ty - r.y) * k;
    p.rot = r.rot + (r.trot - r.rot) * k; p.sx = r.sx + (0.85 - r.sx) * k;
    var fade = s - 0.4 - r.stay;
    if (fade > 1.2) return false;
    p.a = r.a * (fade > 0 ? 1 - smooth01(fade / 1.2) : 1);
    return true;
  }

  // ---------------------------------------------------------------- glyphs
  function buildGlyphs(season, dpr, colors) {
    var px = 1 / dpr, g = [];
    for (var d = 0; d < 3; d++) {
      var o = {};
      if (season === 'winter') {
        var R = [2.8, 3.8, 5.0][d], arms = new Path2D();
        for (var i = 0; i < 6; i++) {
          var a = (i * 60 - 90) * DEG;
          arms.moveTo(0, 0); arms.lineTo(R * cos(a), R * sin(a));
        }
        o.arms = arms; o.w = max(R * 0.16, px); o.size = R;
      } else if (season === 'spring') {
        var L = [7, 9, 11.5][d], hub = -0.07 * L, body = new Path2D(), fil = new Path2D();
        body.moveTo(0, 0.29 * L);
        body.bezierCurveTo(0.038 * L, 0.33 * L, 0.036 * L, 0.45 * L, 0, 0.50 * L);
        body.bezierCurveTo(-0.036 * L, 0.45 * L, -0.038 * L, 0.33 * L, 0, 0.29 * L);
        fil.moveTo(0, 0.30 * L); fil.lineTo(0, hub);
        var n = L > 24 ? 17 : 7;
        for (var k = 0; k < n; k++) {
          var ang = (-78 + 156 * k / (n - 1)) * DEG;
          fil.moveTo(0, hub);
          fil.quadraticCurveTo(sin(ang) * 0.17 * L, hub - cos(ang) * 0.25 * L,
            sin(ang) * 0.43 * L, hub - cos(ang) * 0.43 * L);
        }
        o.body = body; o.fil = fil; o.w = max(0.05 * L, px); o.size = L;
      } else if (season === 'summer') {
        var r = [2.0, 2.8, 3.6][d], hr = r * 3.2, c = document.createElement('canvas');
        var sz = Math.ceil(hr * 2 * dpr) + 2;
        c.width = c.height = sz;
        var x = c.getContext('2d'), m = sz / 2, gr = x.createRadialGradient(m, m, 0, m, m, m - 1);
        gr.addColorStop(0, colors.halo); gr.addColorStop(0.35, withAlpha(colors.halo, 0.55));
        gr.addColorStop(1, withAlpha(colors.halo, 0));
        x.fillStyle = gr; x.fillRect(0, 0, sz, sz);
        o.halo = c; o.hs = sz / dpr; o.r = r; o.size = hr;
      } else {
        var Lf = [9, 11.5, 14][d], leaf = new Path2D(), pet = new Path2D(), rib = new Path2D();
        leaf.moveTo(0, 0.34 * Lf);
        leaf.bezierCurveTo(0.355 * Lf, 0.30 * Lf, 0.37 * Lf, -0.15 * Lf, 0, -0.5 * Lf);
        leaf.bezierCurveTo(-0.345 * Lf, -0.14 * Lf, -0.33 * Lf, 0.29 * Lf, 0, 0.34 * Lf);
        pet.moveTo(0, 0.33 * Lf); pet.quadraticCurveTo(0.005 * Lf, 0.45 * Lf, 0.035 * Lf, 0.54 * Lf);
        rib.moveTo(0, 0.31 * Lf); rib.quadraticCurveTo(0.01 * Lf, -0.05 * Lf, 0, -0.43 * Lf);
        o.leaf = leaf; o.pet = pet; o.rib = rib;
        o.w = max(0.03 * Lf, px); o.rw = max(0.035 * Lf, px * 0.8); o.size = Lf;
      }
      g.push(o);
    }
    return g;
  }

  var probe = null;
  function withAlpha(c, a) {
    if (!probe) probe = document.createElement('canvas').getContext('2d');
    probe.fillStyle = '#000'; probe.fillStyle = c;          // normalise any CSS colour
    var m = /^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(probe.fillStyle);
    if (!m) return probe.fillStyle.replace(/[\d.]+\)$/, a + ')');
    return 'rgba(' + parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) + ',' + a + ')';
  }

  // Draw one particle; the transform is already set to its position, rotation and scale.
  function drawGlyph(ctx, season, o, p, colors) {
    if (season === 'winter') {
      ctx.lineWidth = o.w; ctx.stroke(o.arms);
    } else if (season === 'spring') {
      ctx.fill(o.body); ctx.lineWidth = o.w; ctx.stroke(o.fil);
    } else if (season === 'summer') {
      var a = ctx.globalAlpha;
      ctx.globalAlpha = a * 0.50 * p.b;
      ctx.drawImage(o.halo, -o.hs / 2, -o.hs / 2, o.hs, o.hs);
      ctx.globalAlpha = a * (0.50 + 0.50 * p.b);
      ctx.beginPath(); ctx.arc(0, 0, o.r * (0.72 + 0.28 * p.b), 0, TAU); ctx.fill();
      ctx.globalAlpha = a;
    } else {
      ctx.fill(o.leaf); ctx.lineWidth = o.w; ctx.stroke(o.pet);
      ctx.strokeStyle = colors.bg; ctx.lineWidth = o.rw; ctx.stroke(o.rib);
      ctx.strokeStyle = colors.ink;
    }
  }

  // ---------------------------------------------------------------- preferences
  function readPref() {
    try { return localStorage.getItem('motion'); } catch (e) { return null; }
  }
  function reducedMotion() {
    return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }
  function saveData() {
    var c = navigator.connection; return !!(c && c.saveData);
  }

  // ---------------------------------------------------------------- engine
  function start(host, opts) {
    opts = opts || {};
    var season = opts.season || document.documentElement.getAttribute('data-season') || 'winter';
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;opacity:0;z-index:-1';
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    host.style.isolation = 'isolate';
    host.insertBefore(canvas, host.firstChild);
    var ctx = canvas.getContext('2d');

    var F = { w: 1, h: 1, dir: 1 }, dpr = 1, glyphs = null, colors = null, pool = [];
    var R = mulberry32(opts.seed != null ? opts.seed : (Date.now() ^ (Math.random() * 1e9)) >>> 0);
    var S = { R: R, last: [], bagY: [], nextLand: 12, rest: null, pickX: null, pickY: null };
    var t = 0, tShown = 0, raf = 0, lastNow = 0, running = false, visible = true;
    var avoid = [], traceOn = !!opts.trace, trace = [], nextTrace = 0, spawnAt = 0, interval = 1;
    var statSum = 0, statN = 0, statMax = 0, shownOpacity = -1;

    S.pickX = function (lo, hi) {
      var x, tries = 0;
      do {
        x = (lo + (hi - lo) * R()) * F.w; tries++;
      } while (tries < 24 && ((S.last[0] != null && abs(x - S.last[0]) < 0.25 * F.w) ||
                              (S.last[1] != null && abs(x - S.last[1]) < 0.15 * F.w)));
      S.last[1] = S.last[0]; S.last[0] = x;
      return x;
    };
    S.pickY = function (lo, hi) {              // stratified bag: even vertical spread
      if (!S.bagY.length) {
        for (var i = 0; i < 8; i++) S.bagY.push(i);
        for (var j = 7; j > 0; j--) { var k = Math.floor(R() * (j + 1)), tmp = S.bagY[j]; S.bagY[j] = S.bagY[k]; S.bagY[k] = tmp; }
      }
      var s = S.bagY.pop();
      return (lo + (hi - lo) * (s + R()) / 8) * F.h;
    };

    function readColors() {
      if (opts.colors && opts.colors[season]) return opts.colors[season];
      var cs = getComputedStyle(document.documentElement);
      return {
        ink: (cs.getPropertyValue('--motion-ink') || '#35618A').trim(),
        halo: (cs.getPropertyValue('--motion-halo') || '#C99F45').trim(),
        bg: (cs.getPropertyValue('--motion-bg') || '#FFFFFF').trim()
      };
    }

    function target() {
      var spec = SEASONS[season], phone = F.w < 640;
      var n = spec.count[phone ? 1 : 0] * min(1.2, max(0.6, (F.w * F.h) / REF_AREA));
      if ((navigator.hardwareConcurrency || 8) <= 4) n *= 0.7;
      return max(3, Math.round(n));
    }

    function free() {
      for (var i = 0; i < pool.length; i++) if (!pool[i].alive) return pool[i];
      return null;
    }

    function spawn(ts) {
      var p = free(), i;
      if (!p && pool.length >= 24) {
        // recycle particles that have already left the field by `ts` (matters during pre-warm)
        for (i = 0; i < pool.length; i++) {
          if (pool[i].alive && ts >= pool[i].ts && !SEASONS[season].state(pool[i], ts, F, S)) pool[i].alive = false;
        }
        p = free();
        if (!p) return;
      }
      if (!p) { p = {}; pool.push(p); }
      var r = R(); p.d = r < DEPTH_SHARE[0] ? 0 : r < DEPTH_SHARE[0] + DEPTH_SHARE[1] ? 1 : 2;
      p.ts = ts; p.alive = true; p.py = undefined; p.rest = null;
      SEASONS[season].init(p, R, F, S);
      p.hist = traceOn ? [] : null;
    }

    function schedule(now) {
      while (spawnAt <= now) {
        spawn(spawnAt);
        spawnAt += interval * (0.65 + 0.7 * R());
      }
    }

    function measure() {
      var r = host.getBoundingClientRect();
      var nd = min(2, root.devicePixelRatio || 1);
      var w = max(1, r.width), h = max(1, r.height);
      var changed = w !== F.w || h !== F.h || nd !== dpr;
      F.w = w; F.h = h; dpr = nd;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      avoid = [];
      (opts.avoid || []).forEach(function (el) {
        var b = el.getBoundingClientRect();
        avoid.push({ x0: b.left - r.left, y0: b.top - r.top, x1: b.right - r.left, y1: b.bottom - r.top });
      });
      if (opts.rest) {
        var b = opts.rest.getBoundingClientRect();
        S.rest = { x0: b.left - r.left, x1: b.right - r.left, y: b.top - r.top };
      } else S.rest = null;
      colors = readColors();
      glyphs = buildGlyphs(season, dpr, colors);
      interval = SEASONS[season].period(F) / target();
      return changed;
    }

    function reset() {
      measure();
      pool.length = 0; S.last = []; S.bagY = []; trace = [];
      F.dir = R() < 0.5 ? -1 : 1;
      interval = SEASONS[season].period(F) / target();
      t = 0; spawnAt = -PREWARM; nextTrace = 0; S.nextLand = 10 + 10 * R();
      schedule(0);                                 // pre-warm: field starts populated
      var spec = SEASONS[season], i;
      if (traceOn) {
        for (var tq = -TRACE_WIN; tq < 0; tq += 0.25) {
          for (i = 0; i < pool.length; i++) {
            var p = pool[i];
            if (!p.alive || tq < p.ts || !spec.state(p, tq, F, S)) continue;
            p.hist.push({ t: tq, x: p.x, y: p.y, rot: p.rot, sx: p.sx, b: p.b, a: p.a,
              ex: Math.abs(tq / TRACE_DT - Math.round(tq / TRACE_DT)) < 1e-6 });
          }
        }
      }
      for (i = 0; i < pool.length; i++) {
        if (!spec.state(pool[i], 0, F, S)) pool[i].alive = false;
      }
      tShown = 0; shownOpacity = -1;
    }

    function avoidFactor(x, y) {
      var f = 1;
      for (var i = 0; i < avoid.length; i++) {
        var a = avoid[i];
        var dx = max(a.x0 - x, 0, x - a.x1), dy = max(a.y0 - y, 0, y - a.y1);
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < AVOID_FEATHER) f = min(f, AVOID_FLOOR + (1 - AVOID_FLOOR) * (d / AVOID_FEATHER));
      }
      return f;
    }

    function place(p, scale) {
      var c = cos(p.rot) * dpr, s = sin(p.rot) * dpr, k = scale || 1;
      // rotate, then foreshorten along the glyph's own width axis
      ctx.setTransform(c * p.sx * k, s * p.sx * k, -s * k, c * k, p.x * dpr, p.y * dpr);
    }

    function draw() {
      var spec = SEASONS[season], fade = Math.round(smooth01(tShown / PAGE_FADE) * 1000) / 1000;
      if (fade !== shownOpacity) { canvas.style.opacity = String(fade); shownOpacity = fade; }
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = colors.ink; ctx.strokeStyle = colors.ink; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      for (var i = 0; i < pool.length; i++) {
        var p = pool[i];
        if (!p.alive) continue;
        if (!spec.state(p, t, F, S)) { p.alive = false; continue; }
        var o = glyphs[p.d], sc = (p.R || p.L || p.r) / (o.size || 1);
        if (season === 'summer') sc = 1;
        if (traceOn) drawTrace(p, o, sc);
        ctx.globalAlpha = p.a * avoidFactor(p.x, p.y);
        if (ctx.globalAlpha < 0.004) continue;
        place(p, season === 'summer' ? 1 : sc);
        drawGlyph(ctx, season, o, p, colors);
      }
      ctx.globalAlpha = 1;
    }

    // Chronophotograph debug view: exposures every 0.75 s over the last 24 s.
    function drawTrace(p, o, sc) {
      var h = p.hist;
      if (!h) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.globalAlpha = 0.18 + 0.08 * p.d; ctx.lineWidth = 0.6;
      ctx.beginPath();
      for (var j = 0; j < h.length; j++) { if (j) ctx.lineTo(h[j].x, h[j].y); else ctx.moveTo(h[j].x, h[j].y); }
      ctx.lineTo(p.x, p.y); ctx.stroke();
      for (var k = 0; k < h.length; k++) {
        var q = h[k];
        if (!q.ex) continue;
        var age = t - q.t, rec = 0.10 + 0.90 * Math.pow(max(0, 1 - age / TRACE_WIN), 1.7);
        ctx.globalAlpha = q.a * rec;
        place(q, season === 'summer' ? 1 : sc);
        drawGlyph(ctx, season, o, q, colors);
      }
    }

    function record() {
      if (!traceOn) return;
      while (nextTrace <= t) {
        for (var i = 0; i < pool.length; i++) {
          var p = pool[i];
          if (!p.alive || !p.hist) continue;
          p.hist.push({ t: nextTrace, x: p.x, y: p.y, rot: p.rot, sx: p.sx, b: p.b, a: p.a,
            ex: Math.abs((nextTrace / TRACE_DT) - Math.round(nextTrace / TRACE_DT)) < 1e-6 });
          while (p.hist.length && t - p.hist[0].t > TRACE_WIN) p.hist.shift();
        }
        nextTrace = Math.round((nextTrace + 0.25) * 4) / 4;
      }
    }

    function frame(now) {
      raf = 0;
      if (!running) return;
      var dt = lastNow ? min(DT_MAX, (now - lastNow) / 1000) : 0;
      lastNow = now;
      var t0 = performance.now();
      t += dt; tShown += dt;
      schedule(t);
      draw();
      record();
      var ms = performance.now() - t0;
      statSum += ms; statN++; if (ms > statMax) statMax = ms;
      raf = root.requestAnimationFrame(frame);
    }

    function shouldRun() {
      if (reducedMotion()) return false;
      var pref = readPref();
      if (pref === 'off') return false;
      if (pref !== 'on' && saveData()) return false;
      return visible && document.visibilityState !== 'hidden';
    }

    function update() {
      var go = shouldRun();
      if (go && !running) {
        if (canvas.style.opacity === '0') { tShown = 0; shownOpacity = -1; }
        running = true; lastNow = 0;
        if (!raf) raf = root.requestAnimationFrame(frame);
      } else if (!go && running) {
        running = false;
        if (raf) { root.cancelAnimationFrame(raf); raf = 0; }
      }
      // Off or reduced motion hides the canvas even when the loop was already paused (hero
      // off-screen, tab hidden), so no frozen frame is left behind. (site fix; see PR)
      if (!go && (reducedMotion() || readPref() === 'off')) { canvas.style.opacity = '0'; shownOpacity = 0; }
    }

    var io = 'IntersectionObserver' in root ? new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting; update();
    }) : null;
    if (io) io.observe(host);
    var ro = 'ResizeObserver' in root ? new ResizeObserver(function () {
      measure();                       // never reset on resize: no jumps when a phone's toolbar hides
    }) : null;
    if (ro) ro.observe(host);
    var mq = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : null;
    function onVis() { update(); }
    document.addEventListener('visibilitychange', onVis);
    if (mq && mq.addEventListener) mq.addEventListener('change', onVis);
    if (navigator.getBattery) {
      navigator.getBattery().then(function (b) {
        if (!b.charging && b.level < 0.2 && readPref() !== 'on') { visible = false; update(); }
      }).catch(function () {});
    }

    reset();
    update();

    return {
      setSeason: function (s) { if (SEASONS[s]) { season = s; reset(); update(); } },
      setTrace: function (on) { traceOn = !!on; reset(); },
      land: function () { S.nextLand = t; },          // autumn: next leaf crossing the line settles
      pause: function () { try { localStorage.setItem('motion', 'off'); } catch (e) {} update(); },
      play: function () { try { localStorage.setItem('motion', 'on'); } catch (e) {} update(); },
      refresh: function () { measure(); },
      stats: function () {
        var r = { avgMs: statN ? statSum / statN : 0, maxMs: statMax, frames: statN, particles: pool.filter(function (p) { return p.alive; }).length, resting: pool.filter(function (p) { return p.alive && p.rest; }).length };
        statSum = statN = statMax = 0;
        return r;
      },
      destroy: function () {
        running = false; if (raf) root.cancelAnimationFrame(raf);
        if (io) io.disconnect(); if (ro) ro.disconnect();
        document.removeEventListener('visibilitychange', onVis);
        if (mq && mq.removeEventListener) mq.removeEventListener('change', onVis);
        canvas.remove();
      }
    };
  }

  // ---------------------------------------------------------------- year-line moments
  var EASE_ENTER = 'cubic-bezier(0.22, 1, 0.36, 1)', EASE_SINE = 'cubic-bezier(0.37, 0, 0.63, 1)';

  function moment(season, o) {
    o = o || {};
    if (reducedMotion() || readPref() === 'off' || !Element.prototype.animate) return false;
    var key = 'motion-moment-' + season;
    if (!o.force) {
      try { if (sessionStorage.getItem(key)) return false; sessionStorage.setItem(key, '1'); } catch (e) {}
    }
    var ticks = o.ticks ? Array.prototype.slice.call(o.ticks) : [], n = ticks.length;
    if (season === 'spring') {                          // growth, left to right
      ticks.forEach(function (el, i) {
        el.animate([{ transform: 'scaleY(0)' }, {}],
          { duration: 480, delay: n > 1 ? (i / (n - 1)) * 720 : 0, easing: EASE_ENTER, fill: 'backwards' });
      });
    } else if (season === 'winter') {                   // frost, low-discrepancy order
      var phi = 0.6180339887;
      ticks.forEach(function (el, i) {
        el.animate([{ opacity: 0 }, {}],
          { duration: 400, delay: ((i * phi) % 1) * 1000, easing: EASE_ENTER, fill: 'backwards' });
      });
    } else if (season === 'summer' && o.today) {        // today's marker breathes once
      var h = document.createElement('span');
      h.setAttribute('aria-hidden', 'true');
      h.style.cssText = 'position:absolute;left:50%;top:50%;width:44px;height:44px;margin:-22px 0 0 -22px;' +
        'border-radius:50%;pointer-events:none;opacity:0;background:radial-gradient(closest-side,' +
        'var(--motion-halo,#C99F45),transparent)';
      if (getComputedStyle(o.today).position === 'static') o.today.style.position = 'relative';
      o.today.appendChild(h);
      h.animate([{ opacity: 0 }, { opacity: 0.35 }, { opacity: 0 }], { duration: 2400, easing: EASE_SINE })
        .onfinish = function () { h.remove(); };
    }
    // autumn's moment (a leaf resting on the line) lives in the canvas engine (`rest` option)
    return true;
  }


  // ---------------------------------------------------------------- site wiring
  // <section data-season-motion> … text with [data-motion-avoid] …
  //   <div data-motion-rest> year line, ticks carry [data-motion-tick], today [data-motion-today] </div>
  // </section>
  // <button data-motion-toggle aria-pressed="true">Motion: on</button>
  function auto() {
    var host = document.querySelector('[data-season-motion]');
    if (!host) return null;
    var html = document.documentElement;
    var m = start(host, {
      season: html.getAttribute('data-season') || 'winter',
      avoid: host.querySelectorAll('[data-motion-avoid]'),
      rest: host.querySelector('[data-motion-rest]'),
      trace: /[?&]motion=trace\b/.test(location.search)
      //trace: true
    });
    var season = html.getAttribute('data-season');
    if ('MutationObserver' in root) {
      new MutationObserver(function () {
        var s = html.getAttribute('data-season');
        if (s && s !== season) { season = s; m.setSeason(s); }
      }).observe(html, { attributes: true, attributeFilter: ['data-season'] });
    }
    var btn = document.querySelector('[data-motion-toggle]');
    function label() {
      var on = readPref() !== 'off' && !reducedMotion();
      if (btn) { btn.setAttribute('aria-pressed', String(on)); btn.textContent = 'Motion: ' + (on ? 'on' : 'off'); }
    }
    if (btn) {
      btn.addEventListener('click', function () { if (readPref() === 'off') m.play(); else m.pause(); label(); });
      label();
      // The label follows the system reduced-motion setting while the page is open. (site fix; see PR)
      var rm = root.matchMedia ? root.matchMedia('(prefers-reduced-motion: reduce)') : null;
      if (rm && rm.addEventListener) rm.addEventListener('change', label);
    }
    var go = function () {
      moment(season, { ticks: host.querySelectorAll('[data-motion-tick]'), today: host.querySelector('[data-motion-today]') });
    };
    if (document.readyState === 'complete') go(); else root.addEventListener('load', go, { once: true });
    return m;
  }

  root.SeasonMotion = { start: start, moment: moment, auto: auto, seasons: Object.keys(SEASONS) };
})(window);
