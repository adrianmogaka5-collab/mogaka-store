// --- 1. CART & INITIALIZATION ---
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

function addToCart(name, price) {
    cart.push({ name, price });
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert(name + " added to your cart!");
}

function updateCartCount() {
    const el = document.getElementById('cartCount');
    if (el) el.innerText = cart.length;
}

// --- 2. FILTERS ---
function filterProducts() {
    let input = document.getElementById('productSearch').value.toLowerCase();
    let cards = document.getElementsByClassName('product-card');
    for (let card of cards) {
        let title = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = title.includes(input) ? "" : "none";
    }
}

function filterCategory(cat) {
    let cards = document.getElementsByClassName('product-card');
    let buttons = document.getElementsByClassName('filter-btn');
    for (let btn of buttons) {
        btn.classList.remove('active');
        if (btn.innerText.toLowerCase() === cat) btn.classList.add('active');
    }
    for (let card of cards) {
        let itemCat = card.getAttribute('data-category');
        card.style.display = (cat === 'all' || itemCat === cat) ? "" : "none";
    }
}

// --- 3. CURRENCY ---
function updateCurrency() {
    const currency = document.getElementById('currencySelector').value;
    const priceTags = document.querySelectorAll('.price-tag');
    const rate = 130;
    priceTags.forEach(tag => {
        let base = parseFloat(tag.getAttribute('data-price'));
        tag.innerText = currency === "KSH" ? "KSh " + (base * rate).toLocaleString() : "$" + base.toFixed(2);
    });
}

// --- 4. CHECKOUT ---
function calculateTotal() { return cart.reduce((sum, item) => sum + item.price, 0); }

function checkoutMpesa() {
    if(cart.length === 0) return alert("Cart is empty!");
    let total = (calculateTotal() * 130).toLocaleString();
    let msg = `Hello Mogaka Store, I want to pay KSh ${total} via M-Pesa.`;
    window.open(`https://wa.me/254769128327?text=${encodeURIComponent(msg)}`, '_blank');
    window.location.href = "thank-you.html";
}

// --- 5. EXTRAS (Timer, Reviews, Newsletter) ---
function startCountdown() {
    const countDownDate = new Date().getTime() + (12 * 60 * 60 * 1000);
    setInterval(function() {
        const now = new Date().getTime();
        const dist = countDownDate - now;
        if (document.getElementById("hours")) {
            document.getElementById("hours").innerHTML = Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            document.getElementById("mins").innerHTML = Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60));
            document.getElementById("secs").innerHTML = Math.floor((dist % (1000 * 60)) / 1000);
        }
    }, 1000);
}

function submitReview() {
    let name = document.getElementById('revName').value;
    if(!name) return alert("Enter name!");
    document.getElementById('reviewList').innerHTML += `<p><strong>${name}</strong> ⭐⭐⭐⭐⭐<br>"Great products!"</p>`;
    document.getElementById('revName').value = "";
}

function subscribe() {
    let email = document.getElementById('newsEmail').value;
    if(email.includes("@")) {
        alert("Subscribed! Check your inbox for Mogaka Store deals.");
        document.getElementById('newsEmail').value = "";
    }
}

window.onload = () => {
    if(document.getElementById('currencySelector')) updateCurrency();
    startCountdown();
};