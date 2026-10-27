/**
 * @file form.js — halaman Caption.
 * Validasi input nama produk & harga, lalu buat caption dari template yang dipilih.
 */

/**
 * Fungsi pembuat caption.
 * @callback TemplateFn
 * @param {string} nama - Nama produk.
 * @param {string} harga - Harga yang sudah diformat Rupiah, contoh `"Rp 25.000"`.
 * @param {string} tag - Nama produk dalam bentuk hashtag (PascalCase, tanpa `#`).
 * @returns {string} Caption lengkap.
 */

/**
 * Template caption. Key-nya harus sama dengan `value` di `<select id="template">`.
 * @type {Object<string, TemplateFn>}
 */
const templates = {
    promo: (nama, harga, tag) => `💐 PROMO BUKET BUNGA SPESIAL 💐

Ingin memberi kejutan manis untuk orang tersayang? ${nama} siap mempercantik harimu! 🌷

💰 Cuma ${harga} aja!
✅ Kualitas terjamin
✅ Stok terbatas, siapa cepat dia dapat
✅ Pengiriman cepat ke seluruh Indonesia

Jangan sampai nyesel karena kehabisan ya! ⏰
Pesan sekarang dan kirimkan kebahagiaan lewat bunga ♡

#BloomAndPetal #${tag} #BuketBunga #HadiahIstimewa`,

    santai: (nama, harga, tag) => `Hai bestie! 👋✨

Lagi cari ${nama}? Pas banget, kamu nyasar ke tempat yang tepat 😎

Dengan harga ${harga}, kamu bisa berbagi senyum dan kebahagiaan lewat rangkaian bunga yang indah.

Cocok untuk ulang tahun, wisuda, anniversary, atau sekadar bikin hari seseorang lebih cerah 🎁

Yuk mampir, chat aja kalau ada yang mau ditanyain~ 💬

#${tag} #BuketBunga #SayItWithFlowers #BloomAndPetal`,

    formal: (nama, harga, tag) => `Dengan bangga kami persembahkan:
✦ ${nama} ✦

Rangkaian bunga disusun dengan teliti menggunakan bunga pilihan untuk menghadirkan kesan indah pada setiap momen istimewa Anda.

Harga: ${harga}

Keunggulan:
• Kualitas terjamin dan telah melalui kontrol mutu
• Layanan pelanggan yang responsif
• Pengiriman aman dan tepat waktu

Untuk pemesanan dan informasi lebih lanjut, silakan hubungi kami melalui pesan langsung. Terima kasih atas kepercayaan Anda.

#${tag} #BloomAndPetal #BungaUntukmu #SayItWithFlowers`,
};

const form = document.getElementById("form");

/**
 * Aturan validasi per input. Key-nya sama dengan `id` input di form.
 * Tiap aturan menerima nilai input dan mengembalikan pesan error,
 * atau string kosong `""` kalau valid.
 * @type {Object<string, function(string): string>}
 */
const rules = {
    nama: (v) => {
        v = v.trim();
        if (!v) return "Nama buket bunga wajib diisi.";
        if (v.length < 3) return `Nama buket minimal 3 karakter (sekarang ${v.length}).`;
        if (v.length > 60) return `Nama buket maksimal 60 karakter (sekarang ${v.length}).`;
        if (!/\p{L}/u.test(v)) return "Nama buket harus mengandung huruf.";
        return "";
    },
    harga: (v) => {
        if (!v) return "Harga wajib diisi.";
        const n = Number(v);
        if (!Number.isInteger(n)) return "Harga harus angka bulat, tanpa koma.";
        if (n < 1000) return "Harga minimal Rp 1.000.";
        if (n > 100000000) return "Harga maksimal Rp 100.000.000.";
        return "";
    },
};

/**
 * Validasi satu input: tampilkan pesan error di bawahnya dan set `aria-invalid`.
 * @param {string} id - `id` input, harus ada di {@link rules}.
 * @returns {boolean} `true` kalau valid.
 */
function validate(id) {
    const input = document.getElementById(id);
    const msg = rules[id](input.value);
    document.getElementById(`${id}-error`).textContent = msg;
    input.setAttribute("aria-invalid", msg ? "true" : "false");
    return !msg;
}

// langsung cek pas ngetik, biar error ketahuan tanpa nunggu submit
for (const id in rules) {
    document.getElementById(id).addEventListener("input", () => validate(id));
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const invalid = Object.keys(rules).filter((id) => !validate(id));
    if (invalid.length) {
        document.getElementById(invalid[0]).focus();
        document.getElementById("caption").value = "";
        return;
    }

    const nama = document.getElementById("nama").value.trim();
    const harga = Number(document.getElementById("harga").value)
        .toLocaleString("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
    const template = document.getElementById("template").value;
    // "kopi susu aren" -> "KopiSusuAren"
    const tag = nama.replace(/[^\p{L}\p{N}\s]/gu, "").split(/\s+/)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");

    document.getElementById("caption").value = templates[template](nama, harga, tag);
});
