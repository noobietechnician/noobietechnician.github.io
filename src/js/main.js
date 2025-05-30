// Visitor Counter
function updateVisitorCount() {
    FingerprintJS.load().then(fp => {
        fp.get().then(result => {
            const visitorId = result.visitorId;
            const visitorsRef = db.ref('uniqueVisitors/' + visitorId);

            visitorsRef.once('value')
                .then(snapshot => {
                    if (!snapshot.exists()) {
                        visitorsRef.set(true);
                        const counterRef = db.ref('visitorCount');
                        counterRef.transaction(current => (current || 0) + 1)
                            .then(result => {
                                document.getElementById('visitor-count').textContent = result.snapshot.val();
                            })
                            .catch(error => {
                                console.error("Gagal update jumlah pengunjung:", error);
                            });
                    } else {
                        db.ref('visitorCount').on('value', snapshot => {
                            document.getElementById('visitor-count').textContent = snapshot.val();
                        });
                    }
                });
        });
    });
}

document.addEventListener('DOMContentLoaded', updateVisitorCount);

// Ambil IP dan lokasi client
fetch('https://ipapi.co/json/')
    .then(res => res.json())
    .then(data => {
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

// Tampilkan waktu lokal client
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

// Pop Up Selamat Datang
if (!localStorage.getItem('welcome_shown')) {
    document.getElementById('welcome-popup').style.display = 'flex';
    let counter = 10;
    const counterEl = document.getElementById('popup-counter');
    const interval = setInterval(() => {
        counter--;
        counterEl.textContent = counter;
        if (counter === 0) {
            clearInterval(interval);
            document.getElementById('welcome-popup').style.display = 'none';
            localStorage.setItem('welcome_shown', '1');
        }
    }, 1000);

    // Tombol close
    document.getElementById('popup-close').onclick = function () {
        document.getElementById('welcome-popup').style.display = 'none';
        localStorage.setItem('welcome_shown', '1');
        clearInterval(interval);
    };
}

// Toggle tampil/sembunyi komentar
const toggleBtn = document.getElementById('toggle-comment');
const commentBox = document.getElementById('comment-box');
let commentVisible = false;
toggleBtn.onclick = function () {
    commentVisible = !commentVisible;
    commentBox.style.display = commentVisible ? 'block' : 'none';
    toggleBtn.textContent = commentVisible ? 'Sembunyikan Komentar' : 'Tampilkan Komentar';
};

// Firebase Komentar
const commentsRef = firebase.database().ref('comments');
const commentForm = document.getElementById('comment-form');
const commentInput = document.getElementById('comment-input');
const commentsList = document.getElementById('comments-list');

// Tambahkan fungsi escapeHTML
function escapeHTML(str) {
    return str.replace(/[&<>"'`=\/]/g, function (s) {
        return ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '`': '&#96;',
            '=': '&#61;',
            '/': '&#47;'
        })[s];
    });
}

// Tampilkan komentar
function renderComments(snapshot) {
    try {
        const data = snapshot.val();
        commentsList.innerHTML = '';
        if (!data) {
            commentsList.innerHTML = '<div style="color:#888;font-size:0.98rem;">Belum ada komentar.</div>';
            return;
        }
        const keys = Object.keys(data).sort((a, b) => data[b].timestamp - data[a].timestamp);
        keys.forEach(key => {
            const item = data[key];
            const waktu = new Date(item.timestamp).toLocaleString('id-ID');
            const div = document.createElement('div');
            div.style = "background:#f8fafc;margin-bottom:0.7rem;padding:0.7rem 1rem;border-radius:8px;box-shadow:0 1px 4px #e0e7ef;font-size:1.05rem;";
            div.innerHTML = `<div style="color:#2563eb;font-size:0.92rem;font-weight:700;">Anonim</div>
        <div style="margin:0.3rem 0 0.4rem 0;">${escapeHTML(item.text)}</div>
        <div style="font-size:0.88rem;color:#888;">${waktu}</div>`;
            commentsList.appendChild(div);
        });
    } catch (err) {
        commentsList.innerHTML = '<div style="color:#e11d48;font-size:0.98rem;">Gagal memuat komentar.</div>';
    }
}
commentsRef.on('value', renderComments);

// Kirim komentar
commentForm.onsubmit = function (e) {
    e.preventDefault();
    const text = commentInput.value.trim();
    if (!text) return;
    commentsRef.push({
        text: text,
        timestamp: Date.now()
    }, function (error) {
        if (error) {
            alert('Gagal mengirim komentar. Silakan coba lagi.');
        }
    });
    commentInput.value = '';
};