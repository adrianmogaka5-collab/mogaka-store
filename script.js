const exchangeRate = 135;
let currentCategory = 'All';

// FULL 70+ PRODUCT DATABASE
const products = [
    { name: "iPhone 15 128GB", price: 890, cat: "Phones", img: "iphone15.jpg", badge: "Flash Sale", time: "12:00:00" },
    { name: "HP 250 G8 Core i3", price: 450, cat: "Laptops", img: "hp-laptop.jpg", badge: "Best Seller", time: "" },
    { name: "Infinix Note 40 Pro", price: 260, cat: "Phones", img: "infinix-note.jpg", badge: "New", time: "" },
    { name: "Samsung Galaxy A55", price: 420, cat: "Phones", img: "samsung-a55.jpg", badge: "", time: "" },
    { name: "MacBook Air M2", price: 1050, cat: "Laptops", img: "macbook-air.jpg", badge: "", time: "" },
    { name: "Oraimo Traveler 27k", price: 35, cat: "Accessories", img: "oraimo.jpg", badge: "", time: "" }
];

// Loop to quickly generate 70 products for you
for(let i = 1; i <= 65; i++) {
    products.push({
        name: `Tech Item ${i}`, 
        price: 50 + (i * 15), 
        cat: i % 2 === 0 ? "Phones" : "Laptops", 
        img: "placeholder.jpg", 
        badge: ""
    });
}

function renderProducts(searchQuery = '') {
    const grid = document.getElementById('product-grid');
    const currency = document.getElementById('currency-selector').value;
    if (!grid) return;

    grid.innerHTML = "";
    products.forEach(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCat = currentCategory === 'All' || p.cat === currentCategory;

        if (matchesSearch && matchesCat) {
            const displayPrice = currency === 'KSh' ? 
                "KSh " + (p.price * exchangeRate).toLocaleString() : 
                "$" + p.price.toLocaleString();

            grid.innerHTML += `
                <div class="product-card">
                    ${p.badge ? `<span class="badge flash-sale">${p.badge}</span>` : ''}
                    <img src="${p.img}" alt="${p.name}">
                    <h3>${p.name}</h3>
                    <div class="stars">★★★★★</div>
                    ${p.time ? `<div class="timer">${p.time}</div>` : ''}
                    <p class="price-tag">${displayPrice}</p>
                    <button style="background:#27ae60; color:white; border:none; padding:10px; width:100%; border-radius:6px; cursor:pointer;" 
                    onclick="addToCart('${p.name}', ${p.price})">Add to Cart</button>
                </div>
            `;
        }
    });
}

function filterAll() {
    const query = document.getElementById('search-input').value;
    renderProducts(query);
}

function setCategory(cat) {
    currentCategory = cat;
    document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${cat}`).classList.add('active');
    filterAll();
}

function addToCart(name, usdPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existing = cart.find(i => i.name === name);
    if (existing) { existing.quantity += 1; } 
    else { cart.push({ name, usdPrice, quantity: 1 }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    
    updateCartCount();
    alert("✅ " + name + " added to your cart!");
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').innerText = `(${count})`;
}

window.onload = () => { renderProducts(); updateCartCount(); };