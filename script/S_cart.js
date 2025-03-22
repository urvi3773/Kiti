// S_cart.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase configuration – replace with your actual config details
const firebaseConfig = {
    apiKey: "AIzaSyBktOyKU7CXxe_obLk0WCbQImAIPSldd1s",
    authDomain: "kiti-korean-store-c32ad.firebaseapp.com",
    projectId: "kiti-korean-store-c32ad",
    storageBucket: "kiti-korean-store-c32ad.firebasestorage.app",
    messagingSenderId: "917456056873",
    appId: "1:917456056873:web:389e0b5571f3277fb02238",
    databaseURL: "https://kiti-korean-store-c32ad-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);
let currentUser = null;

// Wait for the authentication state to be determined
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        console.log("User authenticated:", currentUser);
    } else {
        console.error("No authenticated user available. Redirecting to login.");
        window.location.href = "./login.html";
    }
});

// Function to update Firebase cart items
function updateFirebaseCart(cartItems) {
    if (!currentUser) {
        console.error("No authenticated user.");
        return;
    }
    const uid = currentUser.uid;
    const cartRef = ref(db, "users/" + uid + "/cartItems");
    set(cartRef, cartItems)
        .then(() => { console.log("Cart updated in Firebase."); })
        .catch((error) => { console.error("Error updating Firebase cart:", error); });
}

// Function to fetch cart items from Firebase (optional sync)
async function fetchFirebaseCart() {
    if (!currentUser) return [];
    const uid = currentUser.uid;
    const cartRef = ref(db, "users/" + uid + "/cartItems");
    try {
        const snapshot = await get(cartRef);
        return snapshot.exists() ? snapshot.val() : [];
    } catch (error) {
        console.error("Error fetching cart from Firebase:", error);
        return [];
    }
}

/* =================================================
   Add to Cart Functionality (on product pages)
   ================================================= */

function initAddToCart() {
    document.querySelectorAll('.order-btn').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const itemElem = e.target.closest('.Jewellery-item');
            if (!itemElem) {
                console.warn("Product element not found.");
                return;
            }
            const productName = itemElem.querySelector('h4').innerText;
            const price = itemElem.querySelector('.price').innerText;
            const imageSrc = itemElem.querySelector('img').src;
            // Create a new item with a default quantity of 1
            const newItem = { productName, price, imageSrc, quantity: 1 };

            // Retrieve the current cart from localStorage (as a fallback)
            let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            cartItems.push(newItem);
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            // Update Firebase with the new cart array
            updateFirebaseCart(cartItems);
            // Redirect to the cart view page
            window.location.href = "../src/addcart.html";
        });
    });
}

/* =================================================
   Cart Display and Update Functionality (cart page)
   ================================================= */

function initCartDisplay() {
    const cartContainer = document.querySelector(".Cart-main-Sub-1");
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    // If cart is empty on load, hide the entire cart section and show S-No-items.
    if (!cartItems || cartItems.length === 0) {
        const cartMain = document.querySelector(".Cart-main");
        const noItemSection = document.querySelector(".S-No-items");
        if (cartMain) cartMain.style.display = "none";
        if (noItemSection) noItemSection.style.display = "flex";
        return;
    }

    cartContainer.innerHTML = ""; // Clear existing content

    cartItems.forEach((item, index) => {
        const itemWrapper = document.createElement("div");
        itemWrapper.classList.add("Cart-main-Sub-1-1");
        itemWrapper.innerHTML = `
      <div class="Cart-main-Sub-1-1-main">
        <img src="${item.imageSrc}" alt="${item.productName}">
        <div class="Cart-main-Sub-data">
          <p>${item.productName}</p>
          <p class="Cart-main-Sub-price">${item.price}</p>
          <div class="Cart-item-quantity">
            <span>Quantity: </span>
            <button class="quantity-decrease" data-index="${index}">-</button>
            <input type="number" min="1" value="${item.quantity}" data-index="${index}" class="quantity-input" />
            <button class="quantity-increase" data-index="${index}">+</button>
          </div>
        </div>
      </div>
      <i class="S-close fa-solid fa-xmark" data-index="${index}"></i>
    `;
        cartContainer.appendChild(itemWrapper);
    });

    // Delegate events for update and removal
    cartContainer.addEventListener("click", (e) => {
        let updatedCart = JSON.parse(localStorage.getItem("cartItems")) || [];

        // Remove item
        if (e.target.classList.contains("S-close")) {
            const index = parseInt(e.target.getAttribute("data-index"));
            updatedCart.splice(index, 1);
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
            e.target.parentElement.remove();
            updateFirebaseCart(updatedCart);

            // If the cart is now empty, hide the entire cart section and show S-No-items.
            if (updatedCart.length === 0) {
                const cartMain = document.querySelector(".Cart-main");
                const noItemSection = document.querySelector(".S-No-items");
                if (cartMain) cartMain.style.display = "none";
                if (noItemSection) noItemSection.style.display = "flex";
            }

        }
        // Decrease quantity
        if (e.target.classList.contains("quantity-decrease")) {
            const index = parseInt(e.target.getAttribute("data-index"));
            if (updatedCart[index].quantity > 1) {
                updatedCart[index].quantity -= 1;
                localStorage.setItem("cartItems", JSON.stringify(updatedCart));
                const input = e.target.parentElement.querySelector(".quantity-input");
                if (input) input.value = updatedCart[index].quantity;
                updateFirebaseCart(updatedCart);
            }
        }
        // Increase quantity
        if (e.target.classList.contains("quantity-increase")) {
            const index = parseInt(e.target.getAttribute("data-index"));
            updatedCart[index].quantity += 1;
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
            const input = e.target.parentElement.querySelector(".quantity-input");
            if (input) input.value = updatedCart[index].quantity;
            updateFirebaseCart(updatedCart);
        }
    });

    // Listen for manual changes to quantity inputs
    document.addEventListener("change", (e) => {
        if (e.target.classList.contains("quantity-input")) {
            const index = parseInt(e.target.getAttribute("data-index"));
            let updatedCart = JSON.parse(localStorage.getItem("cartItems")) || [];
            updatedCart[index].quantity = parseInt(e.target.value) || 1;
            localStorage.setItem("cartItems", JSON.stringify(updatedCart));
            updateFirebaseCart(updatedCart);
        }
    });
}

// Main initialization: Decide which functions to run based on the page.
document.addEventListener("DOMContentLoaded", () => {
    if (document.querySelectorAll(".order-btn").length > 0) {
        initAddToCart();
    }
    if (document.querySelector(".Cart-main-Sub-1")) {
        initCartDisplay();
    }
});
