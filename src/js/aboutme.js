document.getElementById('showNotification').addEventListener('click', function () {
    const notification = document.getElementById('notification');
    notification.classList.add('show');
    notification.classList.remove('hidden');

    // Sembunyikan notifikasi setelah 3 detik
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hidden');
    }, 3000);
});

// Tampilkan notifikasi saat tombol galeri diklik
document.querySelectorAll('.gallery-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    e.preventDefault();
    const notif = document.getElementById('notification');
    notif.querySelector('.notif-text').textContent = 'Belum ada Galeri';
    notif.classList.remove('hidden');
    notif.classList.add('show');
    // Hilangkan otomatis setelah 2.5 detik
    setTimeout(() => {
      notif.classList.remove('show');
      notif.classList.add('hidden');
    }, 2500);
  });
});
