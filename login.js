
if (localStorage.getItem('firstName')) {
    window.location.href = 'catalog.html';
}

const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const loginBtn = document.getElementById('loginBtn');
const errorMessage = document.getElementById('errorMessage');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    // Loading State
    loginBtn.disabled = true;
    loginBtn.textContent = 'Memuat...';
    errorMessage.textContent = '';

    try {
        // Mengambil data pengguna dari API
        const response = await fetch('https://dummyjson.com/users');
        
        if (!response.ok) {
            throw new Error('Koneksi API bermasalah. Silakan coba lagi.');
        }

        const data = await response.json();
        
        //  mencocokkan input form terhadap data API
        const validUser = data.users.find(
            user => user.username === username && user.password === password
        );

        if (validUser) {
            // Simpan firstName ke Local Storage
            localStorage.setItem('firstName', validUser.firstName);
            
            // Arahkan ke halaman katalog produk
            window.location.href = 'catalog.html';
        } else {
            errorMessage.textContent = 'Username atau password salah!';
        }

    } catch (error) {
        // Tampilkan pesan jika gagal fetch
        errorMessage.textContent = error.message;
    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = 'Masuk';
    }
});