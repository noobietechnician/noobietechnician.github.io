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

  function setupCommentForm() {
    const form = document.getElementById('comment-form');
    const input = document.getElementById('comment-input');
    if (!form || !input) return;

    form.onsubmit = function (e) {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) {
        showCommentNotif('Komentar tidak boleh kosong!', false);
        return;
      }
      const commentObj = {
        text,
        time: new Date().toLocaleString('id-ID')
      };
      if (window.db) {
        db.ref('comments').push(commentObj)
          .then(() => {
            input.value = '';
            renderComments();
            showCommentNotif('Komentar berhasil dikirim!', true);
          })
          .catch(() => {
            showCommentNotif('Gagal mengirim komentar. Coba lagi!', false);
          });
      } else {
        try {
          let comments = JSON.parse(localStorage.getItem('comments') || '[]');
          comments.push(commentObj);
          localStorage.setItem('comments', JSON.stringify(comments));
          input.value = '';
          renderComments();
          showCommentNotif('Komentar berhasil dikirim (lokal)!', true);
        } catch {
          showCommentNotif('Gagal menyimpan komentar di browser!', false);
        }
      }
    };
  }

  // Notifikasi komentar
  function showCommentNotif(msg, success) {
    let notif = document.getElementById('comment-notif');
    if (!notif) {
      notif = document.createElement('div');
      notif.id = 'comment-notif';
      notif.style.position = 'fixed';
      notif.style.top = '20px';
      notif.style.left = '50%';
      notif.style.transform = 'translateX(-50%)';
      notif.style.zIndex = '9999';
      notif.style.padding = '0.8rem 1.5rem';
      notif.style.borderRadius = '10px';
      notif.style.fontWeight = 'bold';
      notif.style.fontFamily = "'Roboto Condensed', Arial, sans-serif";
      notif.style.boxShadow = '0 2px 12px #e0e7ef';
      document.body.appendChild(notif);
    }
    notif.textContent = msg;
    notif.style.background = success ? '#22c55e' : '#ef4444';
    notif.style.color = '#fff';
    notif.style.display = 'block';
    setTimeout(() => { notif.style.display = 'none'; }, 2200);
  }

  // --- Render Comments ---
  function renderComments() {
    const commentsList = document.getElementById('comments-list');
    if (!commentsList) return;
    if (window.db) {
      db.ref('comments').once('value').then(snapshot => {
        let comments = snapshot.val();
        if (comments && !Array.isArray(comments)) {
          comments = Object.values(comments);
        }
        if (!comments || comments.length === 0) {
          commentsList.innerHTML = '<div style="color:#888;font-size:0.98rem;">Belum ada komentar.</div>';
          return;
        }
        // Komentar terbaru di atas
        commentsList.innerHTML = comments.reverse().map(c =>
          `<div style="background:#f8fafc;margin-bottom:0.7rem;padding:0.7rem 1rem;border-radius:8px;box-shadow:0 1px 4px #e0e7ef;font-size:1.05rem;">
          <div style="color:#2563eb;font-size:0.92rem;font-weight:700;">Anonymous</div>
          <div style="margin:0.3rem 0 0.4rem 0;">${c.text || ''}</div>
          <div style="font-size:0.88rem;color:#888;">${c.time || ''}</div>
        </div>`
        ).join('');
      }).catch(() => {
        commentsList.innerHTML = '<div style="color:#ef4444;">Gagal memuat komentar dari server.</div>';
      });
    } else {
      let comments = JSON.parse(localStorage.getItem('comments') || '[]');
      if (!comments.length) {
        commentsList.innerHTML = '<div style="color:#888;font-size:0.98rem;">Belum ada komentar.</div>';
        return;
      }
      commentsList.innerHTML = comments.reverse().map(c =>
        `<div style="background:#f8fafc;margin-bottom:0.7rem;padding:0.7rem 1rem;border-radius:8px;box-shadow:0 1px 4px #e0e7ef;font-size:1.05rem;">
        <div style="color:#2563eb;font-size:0.92rem;font-weight:700;">Anonymous</div>
        <div style="margin:0.3rem 0 0.4rem 0;">${c.text}</div>
        <div style="font-size:0.88rem;color:#888;">${c.time}</div>
      </div>`
      ).join('');
    }
  }

  // --- Render Visitor Count ---
  function renderVisitorCount() {
    const el = document.getElementById('visitor-count');
    if (window.db && el) {
      db.ref('visitorCount').on('value', snapshot => {
        el.textContent = snapshot.val() || 0;
      });
    } else if (el) {
      el.textContent = 'Tidak tersedia';
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
    setupCommentForm();
    renderComments();
    renderVisitorCount();
  }

  document.addEventListener('DOMContentLoaded', init);

  // Expose for debug or external use if needed
  return { slider, hero, about };
})();

// Update waktu lokal di elemen #client-time
function updateLocalTime() {
  const el = document.getElementById('client-time');
  if (!el) return;
  const now = new Date();
  const waktu = now.toLocaleString('id-ID', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  el.textContent = waktu;
}

// Jalankan saat halaman dimuat dan perbarui setiap detik
document.addEventListener('DOMContentLoaded', () => {
  updateLocalTime();
  setInterval(updateLocalTime, 1000);
});

/*
fetch('https://ipapi.co/json/')
  .then(res => res.json())
  .then data => {
    document.getElementById('client-ip').textContent = data.ip || 'Tidak diketahui';
    let lokasi = '';
    if (data.city) lokasi += data.city + ', ';
    if (data.region) lokasi += data.region + ', ';
    if (data.country_name) lokasi += data.country_name;
    document.getElementById('client-location').textContent = lokasi || 'Tidak diketahui';
  })
  .catch(() => {
    document.getElementById('client-ip').textContent = 'Tidak diketahui';
    document.getElementById('client-location').textContent = 'Tidak diketahui';
  });

function updateTime() {
  const now = new Date();
  const waktu = now.toLocaleString('id-ID', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  document.getElementById('client-time').textContent = waktu;
}
setInterval(updateTime, 1000);
updateTime();
*/