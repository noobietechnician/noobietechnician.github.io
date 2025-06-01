// Slider Function
let currentSlide = 0;
let slideInterval;

function moveSlide(index) {
  const slidesWrapper = document.querySelector('.slides-wrapper');
  const slides = document.querySelectorAll('.slides-wrapper .slide');
  if (!slidesWrapper) return;
  currentSlide = index;
  slidesWrapper.style.transform = `translateX(-${index * 100}%)`;
  slides.forEach((slide, idx) => {
    if (idx === index) {
      slide.classList.add('active');
    } else {
      slide.classList.remove('active');
    }
  });
  setActiveButton(index);
}

function showNextSlide() {
  const slides = document.querySelectorAll('.slides-wrapper .slide');
  currentSlide = (currentSlide + 1) % slides.length;
  moveSlide(currentSlide);
}

function setActiveButton(index) {
  document.querySelectorAll('.slider-controls button').forEach((btn, idx) => {
    btn.classList.toggle('active', idx === index);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  moveSlide(0);

  slideInterval = setInterval(showNextSlide, 5000);

  // Animate Skills on load + set color
  document.querySelectorAll('.skill-fill').forEach(bar => {
    const percent = bar.getAttribute('data-percent');
    let value = parseInt(percent);
    // Warna: Merah (0-39), Kuning (40-69), Hijau (70-100)
    let color = 'rgb(220, 38, 38)'; // merah
    if (value >= 70) color = 'rgb(34,197,94)'; // hijau
    else if (value >= 40) color = 'rgb(251,191,36)'; // kuning
    bar.style.background = color;
    setTimeout(() => {
      bar.style.width = percent;
    }, 300);
  });

  // Tombol slider
  document.querySelectorAll('.slider-controls button').forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      moveSlide(idx);
      clearInterval(slideInterval);
      slideInterval = setInterval(showNextSlide, 5000);
    });
  });

  // HERO SLIDER FIX
  let heroCurrent = 0;
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroBtns = document.querySelectorAll('.hero-slider-btn');
  let heroInterval;

  function showHeroSlide(idx) {
    heroSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === idx);
      heroBtns[i].classList.toggle('active', i === idx);
    });
    heroCurrent = idx;
  }

  function nextHeroSlide() {
    let next = (heroCurrent + 1) % heroSlides.length;
    showHeroSlide(next);
  }

  heroBtns.forEach((btn, idx) => {
    btn.onclick = () => {
      showHeroSlide(idx);
      clearInterval(heroInterval);
      heroInterval = setInterval(nextHeroSlide, 5000);
    };
  });

  showHeroSlide(0);
  heroInterval = setInterval(nextHeroSlide, 5000);
});

// About Slide Logic
let aboutCurrent = 0;
const aboutImgs = document.querySelectorAll('.about-img');
const aboutCaptions = document.querySelectorAll('.about-caption .caption-box');

function showAboutSlide(idx) {
  aboutImgs.forEach((img, i) => img.classList.toggle('active', i === idx));
  aboutCaptions.forEach((cap, i) => cap.classList.toggle('active', i === idx));
}

function changeAboutSlide(dir) {
  aboutCurrent += dir;
  if (aboutCurrent < 0) aboutCurrent = aboutImgs.length - 1;
  if (aboutCurrent >= aboutImgs.length) aboutCurrent = 0;
  showAboutSlide(aboutCurrent);
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
  showAboutSlide(aboutCurrent);
});

// Skill Bar Animation
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.skill-fill').forEach(function (el) {
    const percent = el.getAttribute('data-percent');
    el.style.width = percent;
  });
});

// Scroll smooth ke section berikutnya saat klik tombol panah di hero
document.querySelectorAll('.hero-slider-controls button').forEach((btn, idx, arr) => {
  btn.addEventListener('dblclick', () => {
    // Scroll ke section setelah hero
    const nextSection = document.querySelector('.hero-slider').nextElementSibling;
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// Tutup menu hamburger setelah klik salah satu menu (mobile)
document.querySelectorAll('nav a').forEach(link => {
  link.addEventListener('click', function () {
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle && menuToggle.checked) {
      menuToggle.checked = false;
    }
  });
});