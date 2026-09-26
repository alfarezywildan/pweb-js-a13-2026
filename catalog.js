const firstName = localStorage.getItem('firstName');

if (!firstName) {
    window.location.href = 'index.html';
} else {
    const welcomeMessage = document.getElementById('welcomeMessage');
    welcomeMessage.textContent = `Selamat datang, ${firstName}`;
}

const logoutBtn = document.getElementById('logoutBtn');

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('firstName');
    
    window.location.href = 'index.html';
});

const searchInput = document.getElementById('search-input');

function debounce(fungsiUtama, waktuTunda) {
  let timer;
  
  return function(event) {
    clearTimeout(timer); 
    
    timer = setTimeout(() => {
      fungsiUtama(event);
    }, waktuTunda);
  };
}

function jalankanPencarian(event) {
  const kataKunci = event.target.value.toLowerCase();
  
  const produkHasilCari = semuaProduk.filter((produk) => {
    const namaCocok = produk.title.toLowerCase().includes(kataKunci);
    const kategoriCocok = produk.category.toLowerCase().includes(kataKunci);
    
    return namaCocok || kategoriCocok; 
  });
  
  renderProducts(produkHasilCari);
}

searchInput.addEventListener('input', debounce(jalankanPencarian, 500));

const categoryFilter = document.getElementById('category-filter');
const sortFilter = document.getElementById('sort-filter');

function populateCategories() {
  const categories = [...new Set(semuaProduk.map(produk => produk.category))];
  
  categories.forEach(kategori => {
    const option = document.createElement('option');
    option.value = kategori;
    option.textContent = kategori;
    categoryFilter.appendChild(option);
  });
}

function applyFilterAndSort() {
  const kategoriPilihan = categoryFilter.value;
  const susunanPilihan = sortFilter.value;
  
  let produkDiproses = [...semuaProduk];

  if (kategoriPilihan !== 'all') {
    produkDiproses = produkDiproses.filter(produk => produk.category === kategoriPilihan); 
  }

  if (susunanPilihan === 'price-asc') {
    produkDiproses.sort((a, b) => a.price - b.price); // Termurah
  } else if (susunanPilihan === 'price-desc') {
    produkDiproses.sort((a, b) => b.price - a.price); // Termahal
  } else if (susunanPilihan === 'rating-desc') {
    produkDiproses.sort((a, b) => b.rating - a.rating); // Rating Tertinggi
  }

  renderProducts(produkDiproses);
}

categoryFilter.addEventListener('change', applyFilterAndSort);
sortFilter.addEventListener('change', applyFilterAndSort);

const productGrid = document.getElementById('product-grid');

let semuaProduk = []; 

async function fetchProducts() {
  try {
    const response = await fetch('https://dummyjson.com/products');
    
    if (!response.ok) {
        throw new Error('Gagal terhubung ke server');
    }
    
    const data = await response.json();
    semuaProduk = data.products; 

    populateCategories();
    
    renderProducts(semuaProduk);
  } catch (error) {
    productGrid.innerHTML = `<p class="error-msg">Gagal memuat produk :( ${error.message}</p>`;
  }
}

let batasTampil = 10; 
let produkAktif = [];

function renderProducts(products) {
    produkAktif = products;

    productGrid.innerHTML = '';
    
    const produkPotongan = produkAktif.slice(0, batasTampil);
  
  produkPotongan.forEach(produk => {
    const card = document.createElement('div');
    card.classList.add('kartu-produk'); 
    
    card.dataset.id = produk.id; 
    
    card.innerHTML = `
      <span class="badge-kategori">${produk.category}</span>
      <img src="${produk.thumbnail}" alt="${produk.title}">
      <div class="info-produk">
        <h3>${produk.title}</h3>
        <p class="harga">$${produk.price}</p>
        <p class="rating">⭐ ${produk.rating}</p>
        <p class="diskon">Diskon: ${produk.discountPercentage}</p>
        <button class="btn-tambah-keranjang">Tambah ke Keranjang</button>
      </div>
    `;
    
    productGrid.appendChild(card);
  });

  const btnLoadMore = document.getElementById('btn-load-more');
  if (batasTampil >= produkAktif.length) {
    btnLoadMore.style.display = 'none'; 
  } else {
    btnLoadMore.style.display = 'block'; 
  }
}
function muatLebihBanyak() {
  batasTampil += 10;
  renderProducts(produkAktif); 
}

document.getElementById('btn-load-more').addEventListener('click', muatLebihBanyak);

fetchProducts();