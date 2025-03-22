// demo.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBktOyKU7CXxe_obLk0WCbQImAIPSldd1s",
    authDomain: "kiti-korean-store-c32ad.firebaseapp.com",
    projectId: "kiti-korean-store-c32ad",
    storageBucket: "kiti-korean-store-c32ad.firebasestorage.app",
    messagingSenderId: "917456056873",
    appId: "1:917456056873:web:389e0b5571f3277fb02238",
    databaseURL: "https://kiti-korean-store-c32ad-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const appFirebase = initializeApp(firebaseConfig);
const auth = getAuth(appFirebase);
const db = getDatabase(appFirebase);
let currentUser = null;
let currentStep = 0;
let selectedGiftWrap = "";

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
        document.getElementById("step-nav-0").classList.add("locked");
        const backLoginBtn = document.getElementById("back-login-btn");
        if (backLoginBtn) backLoginBtn.style.display = "none";
        loadCartItems();
        if (document.getElementById("optionSame").checked) {
            fetchAndPopulateAddress();
        }
        showStep(1);
    } else {
        showStep(0);
    }
});

// Prevent navigation to Login if logged in
function navigateTo(stepIndex) {
    if (stepIndex === 0 && currentUser) return;
    const navBtn = document.getElementById(`step-nav-${stepIndex}`);
    if (navBtn.classList.contains("locked")) return;
    showStep(stepIndex);
}

// Show current step and update navigation active state
function showStep(stepIndex) {
    currentStep = stepIndex;
    const steps = document.querySelectorAll(".step");
    steps.forEach((step, idx) => {
        step.classList.toggle("active", idx === stepIndex);
    });
    const navButtons = document.querySelectorAll(".steps-nav button");
    navButtons.forEach((btn, idx) => {
        btn.classList.toggle("active", idx === stepIndex);
    });
}

// Load cart items from Firebase and display them, including total price calculation
function loadCartItems() {
    const cartContainer = document.getElementById("cart-items");
    const totalPriceContainer = document.getElementById("total-price");
    if (!currentUser) {
        cartContainer.innerHTML = "<p>Please log in to view your cart.</p>";
        return;
    }
    const uid = currentUser.uid;
    const cartRef = ref(db, "users/" + uid + "/cartItems");
    get(cartRef)
        .then((snapshot) => {
            let totalPrice = 0;
            if (snapshot.exists()) {
                const cartItems = snapshot.val();
                const giftWrap = localStorage.getItem("giftWrap") || "";
                let html = "";
                cartItems.forEach((item, index) => {
                    // Remove currency and commas from price (assumes format "₹31,999")
                    let priceNum = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
                    totalPrice += priceNum * item.quantity;
                    html += `
            <div class="cart-item" id="cart-item-${index}">
              <img src="${item.imageSrc}" alt="${item.productName}">
              <div>
                <h3>${item.productName}</h3>
                <p>Price: ${item.price}</p>
                <p>Quantity: ${item.quantity}</p>
                ${giftWrap ? `<p class="gift-wrap-info">Gift Wrap: ${giftWrap}</p>` : ""}
              </div>
              <button class="remove-btn" onclick="removeCartItem(${index})">×</button>
            </div>
          `;
                });
                cartContainer.innerHTML = html;
                totalPriceContainer.innerHTML = `Total Price: ₹${totalPrice.toLocaleString()}`;
                totalPriceContainer.classList.add("animate-total");
                setTimeout(() => {
                    totalPriceContainer.classList.remove("animate-total");
                }, 1000);
            } else {
                cartContainer.innerHTML = "<p>Your cart is empty.</p>";
                totalPriceContainer.innerHTML = "";
            }
        })
        .catch((error) => {
            console.error("Error fetching cart items:", error);
            cartContainer.innerHTML = "<p>Error loading cart items.</p>";
        });
}

// Remove a cart item by index
function removeCartItem(index) {
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (index < 0 || index >= cartItems.length) return;
    // Remove the item from the array
    cartItems.splice(index, 1);
    // Update localStorage and Firebase
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    const uid = currentUser.uid;
    set(ref(db, "users/" + uid + "/cartItems"), cartItems)
        .then(() => {
            // Optionally, animate the removal or simply reload the cart display
            loadCartItems();
        })
        .catch((error) => {
            console.error("Error removing cart item:", error);
        });
}

// Login form handler
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("userInput").value.trim();
        const password = document.getElementById("passwordInput").value;
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                currentUser = userCredential.user;
                alert("Logged in as " + (currentUser.displayName || currentUser.email));
                document.getElementById("step-nav-0").classList.add("locked");
                const backLoginBtn = document.getElementById("back-login-btn");
                if (backLoginBtn) backLoginBtn.style.display = "none";
                showStep(1);
                loadCartItems();
            })
            .catch((error) => {
                alert("Login failed: " + error.message);
            });
    });
}

// Billing Address functions
function disableAddressFields() {
    const fields = ["f_name", "l_name", "Address", "Add-2", "city", "state", "country", "pincode"];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.disabled = true;
            field.classList.add("in-Disable");
        }
    });
}
function enableAddressFields() {
    const fields = ["f_name", "l_name", "Address", "Add-2", "city", "state", "country", "pincode"];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.disabled = false;
            field.classList.remove("in-Disable");
            field.value = "";
        }
    });
}
function fetchAndPopulateAddress() {
    if (!currentUser) return;
    const uid = currentUser.uid;
    const addressRef = ref(db, "users/" + uid + "/billingAddress");
    get(addressRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                document.getElementById("f_name").value = data.firstName || "";
                document.getElementById("l_name").value = data.lastName || "";
                document.getElementById("Address").value = data.address || "";
                document.getElementById("Add-2").value = data.address2 || "";
                document.getElementById("city").value = data.city || "";
                document.getElementById("state").value = data.state || "";
                document.getElementById("country").value = data.country || "";
                document.getElementById("pincode").value = data.postalCode || "";
            } else {
                console.log("No billing address found for user " + uid);
            }
            disableAddressFields();
        })
        .catch((error) => {
            console.error("Error fetching billing address:", error);
        });
}
function storeBillingAddress() {
    const billingData = {
        firstName: document.getElementById("f_name").value.trim(),
        lastName: document.getElementById("l_name").value.trim(),
        address: document.getElementById("Address").value.trim(),
        address2: document.getElementById("Add-2").value.trim(),
        city: document.getElementById("city").value.trim(),
        state: document.getElementById("state").value.trim(),
        country: document.getElementById("country").value.trim(),
        postalCode: document.getElementById("pincode").value.trim()
    };
    if (!currentUser) return;
    const uid = currentUser.uid;
    set(ref(db, "users/" + uid + "/billingAddress"), billingData)
        .then(() => {
            document.getElementById("step-nav-1").classList.add("locked");
            showStep(2);
        })
        .catch((error) => {
            alert("Error saving billing address.");
        });
}

// Gift Wrap functions
function selectWrap(elem, wrapType) {
    selectedGiftWrap = wrapType;
    document.querySelectorAll(".gift-wrap").forEach(el => el.classList.remove("selected"));
    elem.classList.add("selected");
    localStorage.setItem("giftWrap", selectedGiftWrap);
}
function storeGiftData() {
    if (!currentUser) return;
    let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const giftNote = document.getElementById("giftNote").value.trim();
    // Update each cart item with gift data
    const updatedCartItems = cartItems.map(item => ({
        ...item,
        giftWrap: selectedGiftWrap,
        giftNote: giftNote
    }));
    const uid = currentUser.uid;
    set(ref(db, "users/" + uid + "/cartItems"), updatedCartItems)
        .then(() => {
            document.getElementById("step-nav-2").classList.add("locked");
            const giftContainer = document.getElementById("gift-wraps");
            giftContainer.classList.add("animate-success");
            setTimeout(() => {
                giftContainer.classList.remove("animate-success");
                showStep(3);
            }, 1000);
        })
        .catch((error) => {
            alert("Error saving gift data in cart items.");
        });
}

// Payment demo
function completePayment() {
    alert("Payment completed!");
    window.location.href = "./../index.html";
}

// Event listeners for billing address radio options
document.getElementById("optionSame").addEventListener("change", (e) => {
    if (e.target.checked) {
        fetchAndPopulateAddress();
    }
});
document.getElementById("optionDiff").addEventListener("change", (e) => {
    if (e.target.checked) {
        enableAddressFields();
    }
});

// Expose functions to global scope
window.storeBillingAddress = storeBillingAddress;
window.storeGiftData = storeGiftData;
window.completePayment = completePayment;
window.navigateTo = navigateTo;
window.showStep = showStep;
window.loadCartItems = loadCartItems;
window.selectWrap = selectWrap;
window.removeCartItem = removeCartItem;
