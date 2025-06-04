let articles = [];
let filteredArticles = [];
let currentPage = 1;
const perPage = 10;

const listEl = document.getElementById("toc-list");
const searchInput = document.getElementById("search");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

function renderList() {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    const pageItems = filteredArticles.slice(start, end);

    listEl.innerHTML = "";
    if (pageItems.length === 0) {
        listEl.innerHTML = "<li>Tidak ada artikel ditemukan.</li>";
    } else {
        pageItems.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="${item.link}">${item.title}</a>`;
            listEl.appendChild(li);
        });
    }

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= Math.ceil(filteredArticles.length / perPage);
}

function searchArticles() {
    const keyword = searchInput.value.toLowerCase();
    filteredArticles = articles.filter(article =>
        article.title.toLowerCase().includes(keyword)
    );
    currentPage = 1;
    renderList();
}

// Ambil data JSON dari file eksternal
fetch('others/wikilist.json')
    .then(res => res.json())
    .then(data => {
        // Sortir berdasarkan judul (A-Z)
        data.sort((a, b) => a.title.localeCompare(b.title, 'id', { sensitivity: 'base' }));
        articles = data;
        filteredArticles = data;
        renderList();
    })
    .catch(err => {
        console.error("Gagal memuat data JSON:", err);
        listEl.innerHTML = "<li>Gagal memuat data.</li>";
    });

searchInput.addEventListener("input", searchArticles);
prevBtn.addEventListener("click", () => { currentPage--; renderList(); });
nextBtn.addEventListener("click", () => { currentPage++; renderList(); });