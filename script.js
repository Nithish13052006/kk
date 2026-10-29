/* ─────────────────────────────────────────
   KK BIRYANI — JAVASCRIPT
   Handles: nav scroll, mobile menu, reveal
───────────────────────────────────────── */

(function () {
  'use strict';

  /* ── NAV: Add scrolled class after threshold ── */
  const navHeader = document.getElementById('nav-header');

  function handleNavScroll() {
    if (window.scrollY > 60) {
      navHeader.classList.add('scrolled');
    } else {
      navHeader.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run on load

  /* ── MOBILE MENU TOGGLE ── */
  const navToggle = document.getElementById('nav-toggle');
  const navLinks  = document.getElementById('nav-links');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.classList.toggle('nav-open', isOpen);

      // Animate hamburger → X
      const spans = navToggle.querySelectorAll('span');
      if (isOpen) {
        spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
        spans[1].style.opacity   = '0';
        spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
      } else {
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });

    // Close on nav-link click (mobile)
    navLinks.querySelectorAll('.nav-link, .nav-whatsapp').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        navLinks.classList.contains('is-open') &&
        !navLinks.contains(e.target) &&
        !navToggle.contains(e.target)
      ) {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('nav-open');
        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = '';
        spans[1].style.opacity   = '';
        spans[2].style.transform = '';
      }
    });
  }

  /* ── INTERSECTION OBSERVER: Scroll Reveal ── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all without animation
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* ── SMOOTH ANCHOR SCROLL (offset for fixed nav) ── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10) || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ── FLOATING WA BUTTON: hide near bottom ── */
  const floatingWa = document.getElementById('floating-wa');

  if (floatingWa) {
    const footer = document.querySelector('.site-footer');

    function handleFloatVisibility() {
      if (!footer) return;
      const footerTop = footer.getBoundingClientRect().top;
      const viewH = window.innerHeight;
      if (footerTop < viewH - 40) {
        floatingWa.style.opacity = '0';
        floatingWa.style.pointerEvents = 'none';
      } else {
        floatingWa.style.opacity = '1';
        floatingWa.style.pointerEvents = '';
      }
    }

    window.addEventListener('scroll', handleFloatVisibility, { passive: true });
    handleFloatVisibility();
  }

})();


/* ─────────────────────────────────────────
   REELS CAROUSEL — drag + snap + sound + autoplay
───────────────────────────────────────── */
(function () {
  'use strict';

  var outer   = document.getElementById('reels-outer');
  var track   = document.getElementById('reels-track');
  var dotsWr  = document.getElementById('reels-dots');
  var prevBtn = document.getElementById('reel-prev');
  var nextBtn = document.getElementById('reel-next');

  if (!track || !outer) return;

  var cards   = Array.from(track.querySelectorAll('.reel-card'));
  var dots    = Array.from(dotsWr ? dotsWr.querySelectorAll('.reels-dot') : []);
  var videos  = Array.from(track.querySelectorAll('video'));
  var gap     = 14;
  var current = 0;
  var isDragging      = false;
  var dragStartX      = 0;
  var dragStartScroll = 0;
  var movedDistance   = 0;
  var isCarouselInView = false;

  function getCardWidth() {
    if (cards.length === 0) return 0;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function goTo(index) {
    var cardW = getCardWidth();
    var maxIndex = Math.max(0, cards.length - 1);
    if (index < 0)        index = 0;
    if (index > maxIndex) index = maxIndex;
    current = index;
    track.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
    track.style.transform  = 'translateX(-' + (current * cardW) + 'px)';

    dots.forEach(function (d, i) {
      d.classList.toggle('is-active', i === current);
    });

    // Ensure the active reel plays while inactive reels remain paused & muted
    videos.forEach(function (v, i) {
      if (i === current) {
        if (isCarouselInView) {
          v.play().catch(function () {});
        }
      } else {
        v.pause();
        v.muted = true;
        v.volume = 0;
        var inactiveCard = v.closest('.reel-card');
        if (inactiveCard) {
          var btn = inactiveCard.querySelector('.reel-sound-btn');
          if (btn) btn.classList.remove('is-unmuted');
          var txt = inactiveCard.querySelector('.sound-text');
          if (txt) txt.textContent = 'Unmute';
        }
      }
    });
  }

  // Arrows
  if (prevBtn) {
    prevBtn.addEventListener('click', function () { goTo(current - 1); });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function () { goTo(current + 1); });
  }

  // Dots
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { goTo(i); });
  });

  // Pointer drag (mouse + stylus)
  outer.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'touch') return; // let native touch handlers manage touch
    if (e.target.closest('.reel-sound-btn') || e.target.closest('.reel-nav-btn')) return;
    isDragging      = true;
    dragStartX      = e.clientX;
    movedDistance   = 0;
    var cardW       = getCardWidth();
    dragStartScroll = current * cardW;
    outer.setPointerCapture(e.pointerId);
    track.style.transition = 'none';
  });

  outer.addEventListener('pointermove', function (e) {
    if (!isDragging) return;
    var cardW = getCardWidth();
    var diff  = dragStartX - e.clientX;
    movedDistance = Math.abs(diff);
    var rawX  = dragStartScroll + diff;
    var max   = (cards.length - 1) * cardW;
    if (rawX < 0) rawX = rawX * 0.25;
    if (rawX > max) rawX = max + (rawX - max) * 0.25;
    track.style.transform = 'translateX(-' + rawX + 'px)';
  });

  outer.addEventListener('pointerup', function (e) {
    if (!isDragging) return;
    isDragging = false;
    var diff = dragStartX - e.clientX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? current + 1 : current - 1);
    } else {
      goTo(current);
    }
  });

  outer.addEventListener('pointercancel', function () {
    isDragging = false;
    goTo(current);
  });

  // Touch Swipe for mobile thumb gesture
  var touchStartX = 0;
  var touchStartY = 0;
  var touchMoveX = 0;
  var isSwipingH = false;

  outer.addEventListener('touchstart', function (e) {
    if (e.target.closest('.reel-sound-btn') || e.target.closest('.reel-nav-btn')) return;
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchMoveX  = touchStartX;
    isSwipingH  = false;
    movedDistance = 0;
  }, { passive: true });

  outer.addEventListener('touchmove', function (e) {
    if (e.touches.length !== 1) return;
    touchMoveX = e.touches[0].clientX;
    var diffX  = Math.abs(touchMoveX - touchStartX);
    var diffY  = Math.abs(e.touches[0].clientY - touchStartY);
    movedDistance = Math.max(diffX, diffY);
    if (diffX > 10 && diffX > diffY) {
      isSwipingH = true;
    }
  }, { passive: true });

  outer.addEventListener('touchend', function () {
    if (isSwipingH) {
      var diff = touchStartX - touchMoveX;
      if (Math.abs(diff) > 35) {
        goTo(diff > 0 ? current + 1 : current - 1);
      }
    }
  }, { passive: true });

  window.addEventListener('resize', function () {
    goTo(current);
  }, { passive: true });

  // ── Auto-play muted video handling with IntersectionObserver ──
  videos.forEach(function (v) {
    v.muted = true;
  });

  if ('IntersectionObserver' in window) {
    var reelObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          isCarouselInView = true;
          if (videos[current]) {
            videos[current].play().catch(function () {});
          }
        } else {
          isCarouselInView = false;
          videos.forEach(function (v) { v.pause(); });
        }
      });
    }, { threshold: 0.15 });

    reelObserver.observe(outer);
  } else {
    isCarouselInView = true;
    if (videos[0]) videos[0].play().catch(function () {});
  }

  // ── Audio & Unmute Controller ──
  function toggleAudio(card) {
    var video     = card.querySelector('video');
    var soundBtn  = card.querySelector('.reel-sound-btn');
    var soundText = soundBtn ? soundBtn.querySelector('.sound-text') : null;
    if (!video) return;

    if (video.muted || video.volume === 0) {
      // Mute all other videos
      videos.forEach(function (other) {
        if (other !== video) {
          other.muted = true;
          other.volume = 0;
          var otherCard = other.closest('.reel-card');
          if (otherCard) {
            var otherBtn = otherCard.querySelector('.reel-sound-btn');
            if (otherBtn) otherBtn.classList.remove('is-unmuted');
            var otherTxt = otherCard.querySelector('.sound-text');
            if (otherTxt) otherTxt.textContent = 'Unmute';
          }
        }
      });

      video.muted = false;
      video.defaultMuted = false;
      video.removeAttribute('muted');
      video.volume = 1.0;

      var playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(function () {
          if (soundBtn) soundBtn.classList.add('is-unmuted');
          if (soundText) soundText.textContent = 'Mute';
        }).catch(function (err) {
          console.warn('Audio play request failed:', err);
        });
      } else {
        if (soundBtn) soundBtn.classList.add('is-unmuted');
        if (soundText) soundText.textContent = 'Mute';
      }
    } else {
      video.muted = true;
      video.volume = 0;
      if (soundBtn) soundBtn.classList.remove('is-unmuted');
      if (soundText) soundText.textContent = 'Unmute';
    }
  }

  // ── Attach sound & tap listeners on cards ──
  cards.forEach(function (card) {
    var video    = card.querySelector('video');
    var soundBtn = card.querySelector('.reel-sound-btn');
    var frame    = card.querySelector('.reel-phone-frame');
    if (!video) return;

    if (soundBtn) {
      soundBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleAudio(card);
      });
    }

    if (frame) {
      frame.addEventListener('click', function (e) {
        if (e.target.closest('.reel-sound-btn')) return;
        // Ignore click if a drag gesture occurred
        if (Math.abs(dragStartX - e.clientX) > 6) return;
        toggleAudio(card);
      });
    }
  });

  goTo(0);
})();
