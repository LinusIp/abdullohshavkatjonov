/* Mobile nav, gallery lightbox and the year line. No dependencies. */
(function () {
  'use strict';

  var ICON = {
    prev: '<polyline points="15 18 9 12 15 6"/>',
    next: '<polyline points="9 18 15 12 9 6"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
  };
  function svg(name) {
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICON[name] + '</svg>';
  }

  /* ---------- Mobile nav ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.hidden = false;
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      links.classList.toggle('is-open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.site-nav')) setOpen(false);
    });
  }

  /* ---------- Lightbox ----------
     Items are { href, alt, caption, date, location }. Gallery grids and the
     year line both open it through lightbox.open(items, index, opener). */
  var lightbox = (function () {
    if (typeof HTMLDialogElement !== 'function') return null;
    var dialog, img, caption, meta, prevBtn, nextBtn;
    var items = [], index = 0, opener = null;

    function build() {
      dialog = document.createElement('dialog');
      dialog.className = 'lightbox';
      dialog.setAttribute('aria-label', 'Photo viewer');
      dialog.innerHTML =
        '<button type="button" class="lightbox__btn lightbox__close" data-action="close" aria-label="Close">' + svg('close') + '</button>' +
        '<div class="lightbox__stage"><img class="lightbox__img" alt=""></div>' +
        '<div class="lightbox__bar">' +
          '<div class="lightbox__text" aria-live="polite">' +
            '<p class="lightbox__caption"></p><p class="lightbox__meta"></p>' +
          '</div>' +
          '<div class="lightbox__controls">' +
            '<button type="button" class="lightbox__btn" data-action="prev" aria-label="Previous photo">' + svg('prev') + '</button>' +
            '<button type="button" class="lightbox__btn" data-action="next" aria-label="Next photo">' + svg('next') + '</button>' +
          '</div>' +
        '</div>';
      document.body.appendChild(dialog);
      img = dialog.querySelector('.lightbox__img');
      caption = dialog.querySelector('.lightbox__caption');
      meta = dialog.querySelector('.lightbox__meta');
      prevBtn = dialog.querySelector('[data-action="prev"]');
      nextBtn = dialog.querySelector('[data-action="next"]');

      dialog.addEventListener('click', function (e) {
        var btn = e.target.closest('[data-action]');
        if (btn) {
          var action = btn.getAttribute('data-action');
          if (action === 'close') dialog.close();
          else show(index + (action === 'next' ? 1 : -1));
          return;
        }
        // Clicking the dark area around the photo closes the viewer.
        if (e.target === dialog || e.target.classList.contains('lightbox__stage')) dialog.close();
      });
      dialog.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowRight') { e.preventDefault(); show(index + 1); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); show(index - 1); }
        // Escape is handled natively by <dialog>.
      });
      dialog.addEventListener('close', function () {
        img.removeAttribute('src');
        if (opener) opener.focus();
      });
    }

    function show(i) {
      index = (i + items.length) % items.length;
      var it = items[index];
      img.src = it.href;
      img.alt = it.alt || '';
      caption.textContent = it.caption || '';
      caption.hidden = !it.caption;
      var bits = [it.date, it.location].filter(Boolean);
      bits.push((index + 1) + ' / ' + items.length);
      meta.textContent = bits.join(' · ');
      var single = items.length < 2;
      prevBtn.hidden = single;
      nextBtn.hidden = single;
      // Warm the neighbours so arrowing feels instant.
      [index - 1, index + 1].forEach(function (n) {
        var b = items[(n + items.length) % items.length];
        if (b) { var pre = new Image(); pre.src = b.href; }
      });
    }

    return {
      open: function (list, i, from) {
        if (!dialog) build();
        items = list;
        opener = from || null;
        show(i || 0);
        dialog.showModal();
        dialog.querySelector('[data-action="close"]').focus();
      }
    };
  })();

  if (lightbox) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-gallery]'), function (group) {
      group.addEventListener('click', function (e) {
        var link = e.target.closest('a[data-lightbox]');
        if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        var anchors = Array.prototype.slice.call(group.querySelectorAll('a[data-lightbox]'));
        var list = anchors.map(function (a) {
          var thumb = a.querySelector('img');
          return { href: a.getAttribute('href'), alt: thumb ? thumb.alt : '', caption: a.dataset.caption,
                   date: a.dataset.date, location: a.dataset.location };
        });
        lightbox.open(list, anchors.indexOf(link), link);
      });
    });
  }

  /* ---------- Year line ---------- */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
                'August', 'September', 'October', 'November', 'December'];
  var SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function iso(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function segOf(month) { // month 0-11
    return month <= 1 ? 'wa' : month <= 4 ? 'sp' : month <= 7 ? 'su' : month <= 10 ? 'au' : 'wb';
  }
  function isLeap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  var todayIso = iso(new Date());

  // Keep the footer's static line honest about today when the site was built earlier.
  Array.prototype.forEach.call(document.querySelectorAll('.yl--compact'), function (line) {
    if (+line.getAttribute('data-yl-year') !== new Date().getFullYear()) return;
    var start = new Date(new Date().getFullYear(), 0, 1);
    Array.prototype.forEach.call(line.querySelectorAll('.yl-seg > *'), function (tick, i) {
      var day = iso(new Date(start.getFullYear(), 0, 1 + i));
      tick.classList.toggle('f', day > todayIso);
      tick.classList.toggle('t', day === todayIso);
    });
  });

  var yl = document.querySelector('.yl[data-yl-interactive]');
  if (yl) initYearLine(yl);

  /* ---------- Blog category filter (/blog/ only) ----------
     Rows carry data-topics="|gamedev|coding|"; ?topic=gamedev in the URL is the
     single source of truth, so filtered views can be shared, reloaded and
     walked with back/forward. */
  var topicFilter = document.querySelector('[data-topic-filter]');
  if (topicFilter) initTopicFilter(topicFilter);

  function initTopicFilter(root) {
    var chips = Array.prototype.slice.call(root.querySelectorAll('a.topic[data-topic]'));
    var known = chips.map(function (c) { return c.getAttribute('data-topic'); });
    var rows = Array.prototype.slice.call(document.querySelectorAll('.post-list .post-row[data-topics]'));
    var years = Array.prototype.slice.call(document.querySelectorAll('.year'));
    var empty = document.querySelector('[data-topic-empty]');
    var status = root.querySelector('[data-topic-status]');
    var blogPath = new URL(chips[0].href, location.href).pathname;

    function norm(t) { return (t || '').toLowerCase().split(/\s+/).filter(Boolean).join(' '); }
    function fromUrl() {
      var t = norm(new URLSearchParams(location.search).get('topic'));
      return known.indexOf(t) > -1 ? t : '';
    }
    function apply(topic, announce) {
      var shown = 0;
      rows.forEach(function (row) {
        var match = !topic || row.getAttribute('data-topics').indexOf('|' + topic + '|') > -1;
        row.hidden = !match;
        if (match) shown++;
      });
      years.forEach(function (y) { y.hidden = !y.querySelector('.post-row:not([hidden])'); });
      chips.forEach(function (c) {
        if (c.getAttribute('data-topic') === topic) c.setAttribute('aria-current', 'true');
        else c.removeAttribute('aria-current');
      });
      if (empty) empty.hidden = shown > 0;
      if (announce && status) {
        status.textContent = topic
          ? 'Showing ' + shown + (shown === 1 ? ' post' : ' posts') + ' in ' + topic + '.'
          : 'Showing all ' + shown + ' posts.';
      }
    }
    function go(topic) {
      var url = blogPath + (topic ? '?topic=' + encodeURIComponent(topic) : '');
      if (url !== location.pathname + location.search) history.pushState({ topic: topic }, '', url);
      apply(topic, true);
    }

    // An unknown ?topic= falls back to All; either way the URL is tidied to
    // the canonical form (e.g. "?topic=%20LIFE" becomes "?topic=life").
    var initial = fromUrl();
    var raw = new URLSearchParams(location.search).get('topic');
    if (raw !== null && raw !== initial) {
      history.replaceState(null, '', blogPath + (initial ? '?topic=' + encodeURIComponent(initial) : ''));
    }
    apply(initial, false);

    // Chips, post labels and the "show all" link all filter in place on this page.
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[data-topic]');
      if (!a || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      if (new URL(a.href, location.href).pathname !== blogPath) return;
      var topic = norm(a.getAttribute('data-topic'));
      if (topic && known.indexOf(topic) === -1) return;
      e.preventDefault();
      go(topic);
    });
    window.addEventListener('popstate', function () { apply(fromUrl(), true); });
  }

  function initYearLine(nav) {
    var dataEl = nav.querySelector('.yl-data');
    var entries = [];
    try { entries = JSON.parse(dataEl.textContent); } catch (err) { return; }
    var byDay = {}, years = {};
    entries.forEach(function (e) {
      var day = byDay[e.d] || (byDay[e.d] = { posts: [], photos: [] });
      (e.t === 'p' ? day.posts : day.photos).push(e);
      years[e.d.slice(0, 4)] = true;
    });
    var thisYear = new Date().getFullYear();
    var yearList = Object.keys(years).map(Number).concat(thisYear);
    var minYear = Math.min.apply(null, yearList), maxYear = Math.max.apply(null, yearList);
    var head = nav.querySelector('.yl-head');
    var track = nav.querySelector('.yl-track');
    var tip = nav.querySelector('.yl-tip');
    var shown = thisYear, menuFor = null;

    // Year label, plus previous/next only when other years have content.
    head.innerHTML = '';
    var prev, next, label = document.createElement('span');
    label.className = 'yl-year meta';
    label.setAttribute('aria-live', 'polite');
    if (minYear < maxYear) {
      prev = yearButton('prev'); next = yearButton('next');
      head.appendChild(prev); head.appendChild(label); head.appendChild(next);
    } else {
      head.appendChild(label);
    }
    function yearButton(dir) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'yl-btn';
      b.innerHTML = svg(dir);
      b.addEventListener('click', function () { render(shown + (dir === 'next' ? 1 : -1)); });
      return b;
    }

    function describe(dayIso, info) {
      var d = new Date(dayIso + 'T12:00:00');
      var date = d.getDate() + ' ' + MONTHS[d.getMonth()];
      var parts = info.posts.map(function (p) { return p.n; });
      if (info.photos.length) parts.push(info.photos.length > 1 ? info.photos.length + ' photos' : 'photo');
      var text = parts.length > 2 ? parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1] : parts.join(' and ');
      return date + ': ' + text;
    }

    function render(year) {
      closeMenu(false);
      hideTip();
      shown = year;
      label.textContent = year;
      if (prev) {
        var hadFocus = document.activeElement;
        prev.disabled = year <= minYear; next.disabled = year >= maxYear;
        // A button that just became disabled can't keep focus; hand it to the other one.
        if (hadFocus === prev && prev.disabled) next.focus();
        if (hadFocus === next && next.disabled) prev.focus();
        prev.setAttribute('aria-label', 'Previous year, ' + (year - 1));
        next.setAttribute('aria-label', 'Next year, ' + (year + 1));
      }
      var days = isLeap(year) ? 366 : 365;
      var feb = isLeap(year) ? 29 : 28;
      var counts = { wa: 31 + feb, sp: 92, su: 92, au: 91, wb: 31 };
      track.style.setProperty('--days', days);
      var frag = document.createDocumentFragment(), seg = null, segKey = '';
      var focusable = [];
      for (var i = 0; i < days; i++) {
        var date = new Date(year, 0, 1 + i);
        var key = segOf(date.getMonth());
        if (key !== segKey) {
          seg = document.createElement('div');
          seg.className = 'yl-seg yl-' + key;
          seg.style.setProperty('--n', counts[key]);
          if (key === 'wb') seg.style.setProperty('--col', counts.wa + 2);
          frag.appendChild(seg);
          segKey = key;
        }
        var dayIso = iso(date), info = byDay[dayIso], el;
        if (info) {
          var onePost = info.posts.length === 1;
          if (onePost) {
            el = document.createElement('a');
            el.href = info.posts[0].u;
          } else {
            el = document.createElement('button');
            el.type = 'button';
            if (info.posts.length > 1) { el.setAttribute('aria-haspopup', 'true'); el.setAttribute('aria-expanded', 'false'); }
          }
          el.className = 'yl-day' + (info.posts.length ? ' p' : '') + (info.photos.length ? ' g' : '');
          el.setAttribute('aria-label', describe(dayIso, info));
          el.setAttribute('tabindex', '-1');
          el.dataset.day = dayIso;
          focusable.push(el);
        } else {
          el = document.createElement('i');
        }
        if (dayIso > todayIso) el.classList.add('f');
        else if (dayIso === todayIso) el.classList.add('t');
        seg.appendChild(el);
      }
      track.innerHTML = '';
      track.appendChild(frag);
      // One tab stop: the latest day with content up to today, else the first.
      var past = focusable.filter(function (el) { return el.dataset.day <= todayIso; });
      var start = past.length ? past[past.length - 1] : focusable[0];
      if (start) start.setAttribute('tabindex', '0');
    }

    function contentTicks() { return Array.prototype.slice.call(track.querySelectorAll('.yl-day')); }
    function moveTo(el) {
      contentTicks().forEach(function (t) { t.setAttribute('tabindex', t === el ? '0' : '-1'); });
      el.focus();
    }

    function tipContent(dayIso, interactive) {
      var info = byDay[dayIso];
      var d = new Date(dayIso + 'T12:00:00');
      var html = '<span class="yl-tip__date">' + d.getDate() + ' ' + SHORT[d.getMonth()] + ' ' + d.getFullYear() + '</span><ul>';
      info.posts.forEach(function (p) {
        html += '<li>' + (interactive ? '<a href="' + esc(p.u) + '">' + esc(p.n) + '</a>' : esc(p.n)) + '</li>';
      });
      if (info.photos.length) {
        var cap = info.photos.length > 1 ? info.photos.length + ' photos' : 'Photo' + (info.photos[0].n ? ': ' + info.photos[0].n : '');
        html += '<li>' + (interactive ? '<a href="#" data-yl-photos="' + dayIso + '">' + esc(cap) + '</a>' : esc(cap)) + '</li>';
      }
      return html + '</ul>';
    }
    function esc(s) {
      return String(s).replace(/[&<>"']/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
      });
    }
    function placeTip(el) {
      var nr = nav.getBoundingClientRect(), er = el.getBoundingClientRect();
      tip.hidden = false;
      var w = tip.offsetWidth, h = tip.offsetHeight;
      var left = er.left + er.width / 2 - nr.left - w / 2;
      left = Math.max(0, Math.min(left, nr.width - w));
      var top = er.top - nr.top - h - 8;
      if (top < -nr.top) top = er.bottom - nr.top + 8;
      tip.style.left = left + 'px';
      tip.style.top = top + 'px';
    }
    function showTip(el) {
      if (menuFor) return;
      tip.className = 'yl-tip';
      tip.innerHTML = tipContent(el.dataset.day, false);
      placeTip(el);
      el.classList.add('is-active');
    }
    function hideTip() {
      if (menuFor) return;
      tip.hidden = true;
      Array.prototype.forEach.call(track.querySelectorAll('.is-active'), function (t) { t.classList.remove('is-active'); });
    }
    function openMenu(el) {
      hideTip();
      menuFor = el;
      el.setAttribute('aria-expanded', 'true');
      el.classList.add('is-active');
      tip.className = 'yl-tip is-menu';
      tip.innerHTML = tipContent(el.dataset.day, true);
      placeTip(el);
      var first = tip.querySelector('a');
      if (first) first.focus();
    }
    function closeMenu(returnFocus) {
      if (!menuFor) return;
      var el = menuFor;
      menuFor = null;
      el.setAttribute('aria-expanded', 'false');
      el.classList.remove('is-active');
      tip.hidden = true;
      if (returnFocus) el.focus();
    }
    function openPhotos(dayIso, from) {
      var info = byDay[dayIso];
      if (!lightbox || !info || !info.photos.length) return;
      var d = new Date(dayIso + 'T12:00:00');
      var dateText = pad(d.getDate()) + ' ' + SHORT[d.getMonth()] + ' ' + d.getFullYear();
      lightbox.open(info.photos.map(function (p) {
        return { href: p.u, alt: p.n || 'Photo from ' + dateText, caption: p.n, date: dateText, location: p.l };
      }), 0, from);
    }

    nav.addEventListener('mouseover', function (e) {
      var el = e.target.closest('.yl-day');
      if (el) showTip(el);
    });
    nav.addEventListener('mouseout', function (e) {
      var el = e.target.closest('.yl-day');
      if (el && !el.contains(e.relatedTarget)) hideTip();
    });
    nav.addEventListener('focusin', function (e) {
      var el = e.target.closest('.yl-day');
      if (el) showTip(el);
    });
    nav.addEventListener('focusout', function (e) {
      if (menuFor && !nav.contains(e.relatedTarget)) closeMenu(false);
      else if (!menuFor && e.target.closest('.yl-day')) hideTip();
    });
    nav.addEventListener('click', function (e) {
      var photoLink = e.target.closest('[data-yl-photos]');
      if (photoLink) {
        e.preventDefault();
        var from = menuFor;
        closeMenu(false);
        openPhotos(photoLink.getAttribute('data-yl-photos'), from);
        return;
      }
      var el = e.target.closest('button.yl-day');
      if (!el) return;
      var info = byDay[el.dataset.day];
      if (info.posts.length > 1) { if (menuFor === el) closeMenu(true); else { closeMenu(false); openMenu(el); } }
      else openPhotos(el.dataset.day, el); // photo-only day
    });
    nav.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menuFor) { e.preventDefault(); closeMenu(true); return; }
      var el = e.target.closest('.yl-day');
      if (!el) return;
      var ticks = contentTicks(), i = ticks.indexOf(el), to = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') to = ticks[i + 1];
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') to = ticks[i - 1];
      else if (e.key === 'Home') to = ticks[0];
      else if (e.key === 'End') to = ticks[ticks.length - 1];
      else return;
      e.preventDefault();
      if (to) moveTo(to);
    });
    document.addEventListener('click', function (e) {
      if (menuFor && !nav.contains(e.target)) closeMenu(false);
    });

    render(thisYear);
  }
})();
