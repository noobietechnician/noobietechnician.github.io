const AppUI = (() => {
  // --- Slider Section ---
  const slider = {
    current: 0,
    interval: null,
    slidesWrapper: null,
    slides: [],
    controls: [],
    init() {
      this.slidesWrapper = document.querySelector('.slides-wrapper');
      this.slides = document.querySelectorAll('.slides-wrapper .slide');
      this.controls = document.querySelectorAll('.slider-controls button');
      if (!this.slidesWrapper || this.slides.length === 0) return;
      this.move(0);
      this.interval = setInterval(() => this.next(), 5000);
      this.controls.forEach((btn, idx) => {
        btn.addEventListener('click', () => {
          this.move(idx);
          clearInterval(this.interval);
          this.interval = setInterval(() => this.next(), 5000);
        });
      });
    },
    move(index) {
      if (!this.slidesWrapper) return;
      this.current = index;
      this.slidesWrapper.style.transform = `translateX(-${index * 100}%)`;
      this.slides.forEach((slide, idx) => {
        slide.classList.toggle('active', idx === index);
      });
      this.setActiveButton(index);
    },
    next() {
      this.current = (this.current + 1) % this.slides.length;
      this.move(this.current);
    },
    setActiveButton(index) {
      this.controls.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === index);
      });
    }
  };

  // --- Hero Slider Section ---
  const hero = {
    current: 0,
    interval: null,
    slides: [],
    buttons: [],
    init() {
      this.slides = document.querySelectorAll('.hero-slide');
      this.buttons = document.querySelectorAll('.hero-slider-btn');
      if (this.slides.length === 0) return;
      this.show(0);
      this.interval = setInterval(() => this.next(), 5000);
      this.buttons.forEach((btn, idx) => {
        btn.onclick = () => {
          this.show(idx);
          clearInterval(this.interval);
          this.interval = setInterval(() => this.next(), 5000);
        };
      });
    },
    show(idx) {
      this.slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === idx);
        this.buttons[i].classList.toggle('active', i === idx);
      });
      this.current = idx;
    },
    next() {
      let next = (this.current + 1) % this.slides.length;
      this.show(next);
    }
  };

  // --- About Slide Section ---
  const about = {
    current: 0,
    imgs: [],
    captions: [],
    init() {
      this.imgs = document.querySelectorAll('.about-img');
      this.captions = document.querySelectorAll('.about-caption .caption-box');
      if (this.imgs.length === 0) return;
      this.show(this.current);
      // Agar tombol HTML tetap bisa akses
      window.changeAboutSlide = dir => {
        this.current += dir;
        if (this.current < 0) this.current = this.imgs.length - 1;
        if (this.current >= this.imgs.length) this.current = 0;
        this.show(this.current);
      };
    },
    show(idx) {
      this.imgs.forEach((img, i) => img.classList.toggle('active', i === idx));
      this.captions.forEach((cap, i) => cap.classList.toggle('active', i === idx));
    }
  };

  // --- Skill Bar Animation ---
  function animateSkills() {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      const percent = bar.getAttribute('data-percent');
      let value = parseInt(percent);
      let color = 'rgb(220, 38, 38)';
      if (value >= 70) color = 'rgb(34,197,94)';
      else if (value >= 40) color = 'rgb(251,191,36)';
      bar.style.background = color;
      setTimeout(() => {
        bar.style.width = percent;
      }, 300);
    });
  }

  // --- Miscellaneous ---
  function setupSmoothScrollHero() {
    document.querySelectorAll('.hero-slider-controls button').forEach(btn => {
      btn.addEventListener('dblclick', () => {
        const nextSection = document.querySelector('.hero-slider').nextElementSibling;
        if (nextSection) nextSection.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  function setupHamburgerMenu() {
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', function () {
        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle && menuToggle.checked) {
          menuToggle.checked = false;
        }
      });
    });
  }

  // --- AboutMe Notification (from aboutme.js) ---
  function setupAboutMeNotification() {
    const bioBtn = document.querySelector('.tomboldekoratif');
    if (bioBtn) {
      bioBtn.addEventListener('click', function () {
        alert('Fitur biografi akan segera hadir!');
      });
    }
  }

  // --- Comment Toggle (from main.js) ---
  function setupCommentToggle() {
    const toggleBtn = document.getElementById('toggle-comment');
    const commentBox = document.getElementById('comment-box');
    if (!toggleBtn || !commentBox) return;
    let isShown = false;
    toggleBtn.addEventListener('click', function () {
      isShown = !isShown;
      commentBox.style.display = isShown ? 'block' : 'none';
      toggleBtn.textContent = isShown ? 'Sembunyikan Komentar.' : 'Tampilkan Komentar.';
    });
  }

  // --- Render Comments ---
  function renderComments() {
    const commentsList = document.getElementById('comments-list');
    if (window.db) {
      // gunakan window.db
      db.ref('comments').once('value').then(snapshot => {
        const comments = snapshot.val() || [];
        // render comments dari Firebase
      });
    } else {
      // Fallback LocalStorage
      let comments = JSON.parse(localStorage.getItem('comments') || '[]');
      // render comments dari LocalStorage
    }
  }

  // --- Init All ---
  function init() {
    slider.init();
    hero.init();
    about.init();
    animateSkills();
    setupSmoothScrollHero();
    setupHamburgerMenu();
    setupAboutMeNotification();
    setupCommentToggle();
    renderComments();
  }

  document.addEventListener('DOMContentLoaded', init);

  // Expose for debug or external use if needed
  return { slider, hero, about };
})();