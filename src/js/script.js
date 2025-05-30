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
    bar.style.setProperty('--skill-color', color);
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

  // Bersihkan event listener sebelum menambah baru (opsional, jika script bisa reload)
  heroBtns.forEach((btn, idx) => {
    btn.onclick = null;
    btn.addEventListener('click', () => {
      showHeroSlide(idx);
      clearInterval(heroInterval);
      heroInterval = setInterval(nextHeroSlide, 5000);
    });
  });

  // Inisialisasi pertama
  showHeroSlide(0);
  heroInterval = setInterval(nextHeroSlide, 5000);
});