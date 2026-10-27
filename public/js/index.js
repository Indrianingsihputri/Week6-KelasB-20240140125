/**
 * Katalog Bloom & Petal — data buket bunga, pencarian, dan filter kategori.
 * Katalog dibuat lokal agar contoh toko bunga tetap tampil tanpa API eksternal.
 */
const flowerProducts = [
  { title: "Buket Mawar Merah", category: "Mawar", description: "Romantis dan klasik", price: 185000, stock: 12, rating: 4.9, thumbnail: "https://images.unsplash.com/photo-1548094967-e25a127d1f6d?auto=format&fit=crop&w=800&q=80" },
  { title: "Buket Mawar Pink", category: "Mawar", description: "Lembut dan manis", price: 165000, stock: 8, rating: 4.8, thumbnail: "https://pin.it/2ndQGlEci" },
  { title: "Buket Tulip Pastel", category: "Tulip", description: "Warna pastel yang elegan", price: 220000, stock: 7, rating: 5.0, thumbnail: "https://pin.it/6064hzds0" },
  { title: "Buket Baby's Breath", category: "Baby's Breath", description: "Minimalis dan anggun", price: 135000, stock: 15, rating: 4.7, thumbnail: "https://pin.it/7jwCDLwjI" },
  { title: "Buket Bunga Matahari", category: "Matahari", description: "Ceria untuk orang tersayang", price: 155000, stock: 10, rating: 4.8, thumbnail: "https://pin.it/4jXUTvi3C" },
  { title: "Buket Mix Garden", category: "Mixed Flowers", description: "Campuran bunga segar pilihan", price: 250000, stock: 5, rating: 4.9, thumbnail: "https://pin.it/qNI31ep9N" },
  { title: "Buket Lily Putih", category: "Lily", description: "Sederhana, bersih, berkesan", price: 195000, stock: 9, rating: 4.8, thumbnail: "https://pin.it/6zX02CSTZ" },
  { title: "Buket Wisuda Ceria", category: "Wisuda", description: "Hadiah manis untuk kelulusan", price: 175000, stock: 14, rating: 4.9, thumbnail: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80" }
];

const statusEl = document.getElementById("status");
const gridEl = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const categorySelect = document.getElementById("categorySelect");
let allProducts = [...flowerProducts];

function formatPrice(price) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);
}

function renderProducts(products) {
  gridEl.innerHTML = "";
  if (!products.length) {
    statusEl.textContent = "Buket tidak ditemukan. Coba kata kunci lain ya ♡";
    statusEl.classList.remove("error");
    statusEl.style.display = "block";
    return;
  }
  statusEl.style.display = "none";
  const fragment = document.createDocumentFragment();
  products.forEach((product) => {
    const card = document.createElement("article");
    card.className = "card";
    const lowStock = product.stock < 8;
    card.innerHTML = `
      <span class="stock-badge ${lowStock ? "low" : ""}">${lowStock ? "Stok terbatas" : "Bunga segar"}</span>
      <div class="thumb-wrap"><img src="${product.thumbnail}" alt="${product.title}" loading="lazy"></div>
      <div class="body">
        <div class="category">✿ ${product.category}</div>
        <h3>${product.title}</h3>
        <div class="meta">${product.description} · stok ${product.stock}</div>
        <div class="footer-row">
          <div class="price-tag">${formatPrice(product.price)}</div>
          <div class="rating">★ ${product.rating.toFixed(1)}</div>
        </div>
      </div>`;
    fragment.appendChild(card);
  });
  gridEl.appendChild(fragment);
}

function populateCategoryOptions(products) {
  [...new Set(products.map((p) => p.category))].sort().forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
}

function applyFilters() {
  const keyword = searchInput.value.trim().toLowerCase();
  const category = categorySelect.value;
  const filtered = allProducts.filter((product) =>
    `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(keyword) &&
    (!category || product.category === category)
  );
  renderProducts(filtered);
}

populateCategoryOptions(allProducts);
renderProducts(allProducts);
searchInput.addEventListener("input", applyFilters);
categorySelect.addEventListener("change", applyFilters);
