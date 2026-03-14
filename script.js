// ==========================================
// 1. NAVIGATION & UI UPDATES
// ==========================================

// Updates the number shown in the "Cart (X)" navigation link
function updateCartCount() {
    const countElement = document.getElementById('cartCount');
    if (!countElement) return;

    let cart = JSON.parse(localStorage.getItem('mogakaCart')) || [];
    countElement.innerText = cart.length;
}

// ==========================================
// 2. SHOPPING CART LOGIC
// ==========================================

// Adds a product to the browser's local storage
function addToCart(name, price) {
    let cart = JSON.parse(localStorage.getItem('mogakaCart')) || [];
    cart.push({ name: name, price: price });
    localStorage.setItem('mogakaCart', JSON.stringify(cart));
    
    alert(name + " has been added to your cart!");
    updateCartCount(); // Refresh the counter in the nav bar
}

// Displays the items on the cart.html page and calculates the total
function displayCart() {
    const cartContainer = document.getElementById('cartItems');
    const totalContainer = document.getElementById('cartTotal');
    
    // Only runs if the user is currently on the cart page
    if (!cartContainer || !totalContainer) return;

    let cart = JSON.parse(localStorage.getItem('mogakaCart')) || [];
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p style='text-align:center;'>Your cart is currently empty.</p>";
        totalContainer.innerText = "0.00";
        return;
    }

    cartContainer.innerHTML = ""; 
    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.style.display = "flex";
        itemElement.style.justifyContent = "space-between";
        itemElement.style.padding = "10px";
        itemElement.style.borderBottom = "1px solid #eee";
        itemElement.style.background = "#fff";
        itemElement.style.marginBottom = "5px";
        
        itemElement.innerHTML = `
            <span><strong>${item.name}</strong></span> 
            <span>$${item.price} <button onclick="removeItem(${index})" style="margin-left:10px; color:red; border:none; background:none; cursor:pointer; font-weight:bold;">X</button></span>
        `;
        cartContainer.appendChild(itemElement);
        total += parseFloat(item.price);
    });

    totalContainer.innerText = total.toFixed(2);
}

// Removes a single item from the cart
function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('mogakaCart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('mogakaCart', JSON.stringify(cart));
    
    displayCart();    // Refresh the list
    updateCartCount(); // Refresh the counter
}

// Empties the entire cart
function clearCart() {
    if (confirm("Are you sure you want to empty your entire cart?")) {
        localStorage.removeItem('mogakaCart');
        displayCart();
        updateCartCount();
    }
}

// ==========================================
// 3. FORM HANDLERS (CHECKOUT & CONTACT)
// ==========================================

// Processes the checkout form and redirects to the Thank You page
function processOrder(event) {
    event.preventDefault(); 
    let cart = JSON.parse(localStorage.getItem('mogakaCart')) || [];
    
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Clear data and send to confirmation page
    localStorage.removeItem('mogakaCart');
    window.location.href = "thank-you.html"; 
}

// Handles the message submission on the contact page
function handleContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    
    alert("Thank you, " + name + "! Your message has been sent successfully. We will contact you at " + email + ".");
    
    event.target.reset(); // Clears the form fields
}

// ==========================================
// 4. INITIALIZATION
// ==========================================

// Ensures the cart count and list load whenever any page is opened
window.onload = function() {
    updateCartCount();
    displayCart();
};