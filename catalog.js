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

  batasTampil = 10;
  
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

  batasTampil = 10;

  renderProducts(produkDiproses);
}

categoryFilter.addEventListener('change', applyFilterAndSort);
sortFilter.addEventListener('change', applyFilterAndSort);

const productGrid = document.getElementById('product-grid');

const cartBadge = document.getElementById('cart-badge');
const cartTotal = document.getElementById('cart-total');
const clearCartBtn = document.getElementById('clear-cart');

const productModal = document.getElementById('product-modal');
const modalClose = document.getElementById('modal-close');
const modalImage = document.getElementById('modal-image');
const modalTitle = document.getElementById('modal-title');
const modalPrice = document.getElementById('modal-price');
const modalRating = document.getElementById('modal-rating');
const modalStock = document.getElementById('modal-stock');
const modalBrand = document.getElementById('modal-brand');
const modalCategory = document.getElementById('modal-category');
const modalDescription = document.getElementById('modal-description');
const modalAddCart = document.getElementById('modal-add-cart');

let semuaProduk = []; 

function ambilKeranjang() {
  const dataKeranjang = localStorage.getItem('cart');

  if (dataKeranjang) {
    return JSON.parse(dataKeranjang);
  }

  return [];
}

function simpanKeranjang(keranjang) {
  localStorage.setItem('cart', JSON.stringify(keranjang));

  updateKeranjang();
}

function updateKeranjang() {
  const keranjang = ambilKeranjang();

  const jumlahItem = keranjang.reduce((total, item) => {
    return total + item.quantity;
  }, 0);

  const totalHarga = keranjang.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  cartBadge.textContent = jumlahItem;
  cartTotal.textContent = `$${totalHarga.toFixed(2)}`;
}

function tambahKeKeranjang(idProduk) {
  const produk = semuaProduk.find((produk) => produk.id === idProduk);

  if (!produk) {
    return;
  }

  const keranjang = ambilKeranjang();

  const produkSudahAda = keranjang.find((item) => item.id === idProduk);

  if (produkSudahAda) {
    produkSudahAda.quantity += 1;
  } else {
    keranjang.push({
      id: produk.id,
      title: produk.title,
      price: produk.price,
      thumbnail: produk.thumbnail,
      quantity: 1
    });
  }

  simpanKeranjang(keranjang);
}

function bukaModalProduk(idProduk) {
  const produk = semuaProduk.find((produk) => produk.id === idProduk);

  if (!produk) {
    return;
  }

  modalImage.src = produk.thumbnail;
  modalImage.alt = produk.title;

  modalTitle.textContent = produk.title;
  modalPrice.textContent = `Harga: $${produk.price}`;
  modalRating.textContent = `Rating: ⭐ ${produk.rating}`;
  modalStock.textContent = `Stok: ${produk.stock}`;
  modalBrand.textContent = `Brand: ${produk.brand || '-'}`;
  modalCategory.textContent = `Kategori: ${produk.category}`;
  modalDescription.textContent = produk.description;

  modalAddCart.dataset.id = produk.id;

  productModal.hidden = false;
}

productGrid.addEventListener('click', (event) => {
  const tombolKeranjang = event.target.closest('.btn-tambah-keranjang');

  if (tombolKeranjang) {
    const kartuProduk = tombolKeranjang.closest('.kartu-produk');
    const idProduk = Number(kartuProduk.dataset.id);

    tambahKeKeranjang(idProduk);

    return;
  }

  modalAddCart.addEventListener('click', () => {
  const idProduk = Number(modalAddCart.dataset.id);

  tambahKeKeranjang(idProduk);
  });

  const kartuProduk = event.target.closest('.kartu-produk');

  if (!kartuProduk) {
    return;
  }

  const idProduk = Number(kartuProduk.dataset.id);

  bukaModalProduk(idProduk);
});

modalClose.addEventListener('click', () => {
  productModal.hidden = true;
});

productModal.addEventListener('click', (event) => {
  if (event.target === productModal) {
    productModal.hidden = true;
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    productModal.hidden = true;
  }
});

clearCartBtn.addEventListener('click', () => {
  localStorage.removeItem('cart');

  updateKeranjang();
});

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

updateKeranjang();
fetchProducts();