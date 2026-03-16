const exchangeRate = 135;
let currentCategory = 'All';

// 1. Core Inventory
const products = [
    { name: "iPhone 15 128GB", price: 890, cat: "Phones", img: "https://via.placeholder.com/150", badge: "Flash Sale" },
    { name: "HP 250 G8 Core i3", price: 450, cat: "Laptops", img: "https://via.placeholder.com/150", badge: "Best Seller" },
    { name: "Infinix Note 40 Pro", price: 260, cat: "Phones", img: "https://via.placeholder.com/150", badge: "New" }
];

// Generate dynamic catalog
const brands = ["Samsung Galaxy", "Sony Bravia", "MacBook Air", "Dell Latitude"];
for(let i = 1; i <= 67; i++) {
    const brand = brands[Math.floor(Math.random() * brands.length)];
    products.push({
        name: `${brand} Series ${i}`, 
        price: 150 + (i * 10), 
        cat: i % 2 === 0 ? "Phones" : "Laptops", 
        img: "https://via.placeholder.com/150",
        badge: ""
    });
}

// 2. Gallery Logic
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    const currency = document.getElementById('currency-selector')?.value || 'KSh';
    const query = document.getElementById('search-input')?.value.toLowerCase() || "";
    grid.innerHTML = "";

    products.forEach(p => {
        if ((currentCategory === 'All' || p.cat === currentCategory) && p.name.toLowerCase().includes(query)) {
            const priceVal = currency === 'KSh' ? (p.price * exchangeRate) : p.price;
            const priceLabel = currency === 'KSh' ? `KSh ${priceVal.toLocaleString()}` : `$${priceVal}`;
            
            grid.innerHTML += `
                <div class="product-card" style="border: 1px solid #eee; padding: 15px; border-radius: 12px; text-align: center; background: white;">
                    ${p.badge ? `<span style="background:red; color:white; padding:2px 5px; font-size:10px;">${p.badge}</span>` : ''}
                    <img src="${p.img}" alt="${p.name}" style="width: 100%; height: 120px; object-fit: contain;">
                    <h3 style="font-size:14px;">${p.name}</h3>
                    <p style="font-weight: bold; color: #1a1a2e;">${priceLabel}</p>
                    <button class="add-to-cart-btn" data-name="${p.name}" data-price="${p.price}" 
                        style="background:#27ae60; color:white; border:none; padding:10px; width:100%; border-radius:5px; cursor:pointer;">
                        Add to Cart
                    </button>
                </div>`;
        }
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.onclick = () => addToCart(btn.dataset.name, parseFloat(btn.dataset.price));
    });
}

// 3. Cart & Payment Logic
function addToCart(name, usdPrice) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ name, usdPrice, quantity: 1 });
    localStorage.setItem('cart', JSON.stringify(cart));
    syncAll();
    alert(`✅ ${name} added!`);
}

function syncAll() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Header Count
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = `(${cart.length})`;
    
    // Total Amount Display
    const totalEl = document.getElementById('cart-total-display');
    if (totalEl) {
        let totalKsh = cart.reduce((sum, item) => sum + (item.usdPrice * exchangeRate), 0);
        totalEl.innerText = `Total Amount: KSh ${totalKsh.toLocaleString()}`;
    }

    displayCartItems();
}

function displayCartItems() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; padding:20px;">Your cart is empty.</p>';
        return;
    }

    container.innerHTML = ""; 
    cart.forEach((item, index) => {
        const itemTotal = item.usdPrice * exchangeRate;
        container.innerHTML += `
            <div style="display:flex; justify-content:space-between; padding:10px; border-bottom:1px solid #eee;">
                <div><strong>${item.name}</strong><br><small>Qty: 1</small></div>
                <div style="text-align:right;">
                    KSh ${itemTotal.toLocaleString()}<br>
                    <button onclick="removeItem(${index})" style="color:red; background:none; border:none; cursor:pointer; font-size:12px;">Remove</button>
                </div>
            </div>`;
    });
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    syncAll();
}

// 4. Action Functions
function sendOrder() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) return alert("Cart is empty!");

    let totalKsh = cart.reduce((sum, item) => sum + (item.usdPrice * exchangeRate), 0);
    let msg = `New Order from Mogaka Store:\n`;
    cart.forEach(i => msg += `- ${i.name}\n`);
    msg += `\nTotal: KSh ${totalKsh.toLocaleString()}`;

    window.open(`https://wa.me/254769128327?text=${encodeURIComponent(msg)}`, '_blank');
}

// 5. Initialize
window.onload = () => {
    renderProducts();
    syncAll();

    // Attach Payment Button
    const payBtn = document.getElementById('confirm-payment-btn');
    if (payBtn) payBtn.onclick = sendOrder;

    // Attach Clear Cart Action
    const clearBtn = document.getElementById('clear-cart-action');
    if (clearBtn) {
        clearBtn.onclick = () => {
            if (confirm("Clear your shopping cart?")) {
                localStorage.removeItem('cart');
                syncAll();
            }
        };
    }
};