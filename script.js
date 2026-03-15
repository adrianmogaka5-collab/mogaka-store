// Add item to cart with a success notification
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Check if item already exists in cart
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // The Success Alert
    alert("✅ " + name + " has been added to your cart!");
}

// Load and display cart items
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const container = document.getElementById('cart-items');
    const totalDisplay = document.getElementById('checkout-total');
    
    if (!container) return; // Exit if not on the cart page

    if (cart.length === 0) {
        container.innerHTML = "<p style='color: #888; text-align: center; padding: 20px;'>Your cart is currently empty.</p>";
        totalDisplay.innerText = "KSh 0";
        return;
    }

    let html = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; border-bottom: 1px solid #eee;">
                <div>
                    <strong style="font-size: 1.1em;">${item.name}</strong><br>
                    <span style="color: #666;">KSh ${item.price.toLocaleString()} x ${item.quantity}</span>
                </div>
                <div>
                    <span style="font-weight: bold; margin-right: 15px;">KSh ${itemTotal.toLocaleString()}</span>
                    <button onclick="removeItem(${index})" style="color: #e74c3c; background: none; border: none; cursor: pointer; font-weight: bold;">Remove</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    totalDisplay.innerText = `KSh ${total.toLocaleString()}`;
}

// Remove item function
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCart();
}

// WhatsApp Order Logic
function sendOrderWhatsApp() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalElement = document.getElementById('checkout-total');
    const total = totalElement ? totalElement.innerText : "0";

    if (cart.length === 0) {
        alert("Please add items to your cart first!");
        return;
    }

    let msg = "🚀 *NEW ORDER: MOGAKA ONLINE STORE*%0A";
    msg += "-----------------------------------%0A";
    cart.forEach(item => {
        msg += `• ${item.name} (x${item.quantity}) - KSh ${item.price * item.quantity}%0A`;
    });
    msg += "-----------------------------------%0A";
    msg += `💰 *TOTAL:* ${total}%0A`;
    msg += `✅ *PAYMENT:* M-PESA Sent to 0769128327%0A%0A`;
    msg += `📍 *Delivery Info:* [Type your Name & Location here]`;

    const phone = "254769128327";
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
}

// Run on load
window.onload = function() {
    displayCart();
};