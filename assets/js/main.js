/* Mobile nav + gallery lightbox. No dependencies. */
(function () {
  'use strict';

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

  /* ---------- Lightbox ---------- */
  var groups = document.querySelectorAll('[data-gallery]');
  if (!groups.length || typeof HTMLDialogElement !== 'function') return;

  var ICON = {
    prev: '<polyline points="15 18 9 12 15 6"/>',
    next: '<polyline points="9 18 15 12 9 6"/>',
    close: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'
  };
  function svg(name) {
    return '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
      'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">' + ICON[name] + '</svg>';
  }

  var dialog = document.createElement('dialog');
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

  var img = dialog.querySelector('.lightbox__img');
  var caption = dialog.querySelector('.lightbox__caption');
  var meta = dialog.querySelector('.lightbox__meta');
  var prevBtn = dialog.querySelector('[data-action="prev"]');
  var nextBtn = dialog.querySelector('[data-action="next"]');
  var items = [];
  var index = 0;
  var opener = null;

  function show(i) {
    index = (i + items.length) % items.length;
    var a = items[index];
    var thumb = a.querySelector('img');
    img.src = a.getAttribute('href');
    img.alt = thumb ? thumb.alt : '';
    caption.textContent = a.dataset.caption || '';
    caption.hidden = !a.dataset.caption;
    var bits = [a.dataset.date, a.dataset.location].filter(Boolean);
    bits.push((index + 1) + ' / ' + items.length);
    meta.textContent = bits.join(' · ');
    var single = items.length < 2;
    prevBtn.hidden = single;
    nextBtn.hidden = single;
    // Warm the neighbours so arrowing feels instant.
    [index - 1, index + 1].forEach(function (n) {
      var b = items[(n + items.length) % items.length];
      if (b) { var pre = new Image(); pre.src = b.getAttribute('href'); }
    });
  }

  function open(group, link) {
    items = Array.prototype.slice.call(group.querySelectorAll('a[data-lightbox]'));
    opener = link;
    show(items.indexOf(link));
    dialog.showModal();
    dialog.querySelector('[data-action="close"]').focus();
  }

  Array.prototype.forEach.call(groups, function (group) {
    group.addEventListener('click', function (e) {
      var link = e.target.closest('a[data-lightbox]');
      if (!link || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      open(group, link);
    });
  });

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
})();
