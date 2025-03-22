// wishlist.js

// Import Firebase modules (version 11.3.1 as in Main_Login.js)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, runTransaction } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Firebase configuration (same as in Main_Login.js)
const firebaseConfig = {
    apiKey: "AIzaSyBktOyKU7CXxe_obLk0WCbQImAIPSldd1s",
    authDomain: "kiti-korean-store-c32ad.firebaseapp.com",
    projectId: "kiti-korean-store-c32ad",
    storageBucket: "kiti-korean-store-c32ad.firebasestorage.app",
    messagingSenderId: "917456056873",
    appId: "1:917456056873:web:389e0b5571f3277fb02238",
    databaseURL: "https://kiti-korean-store-c32ad-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase, Auth, and Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// When DOM is ready, attach wishlist button handlers and load wishlist items
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".wishlist-btn").forEach(button => {
        button.addEventListener("click", function (e) {
            e.preventDefault();
            console.log("Wishlist button clicked!");

            // Find the closest product container element
            const productElement = this.closest(".Jewellery-item");
            if (!productElement) {
                console.error("❌ Product container not found!");
                return;
            }
            console.log("✅ Product container found:", productElement);

            // Extract product details from the DOM
            const product = {
                imageSrc: productElement.querySelector("img") ? productElement.querySelector("img").src : "",
                productName: productElement.querySelector("h4") ? productElement.querySelector("h4").textContent : "Unknown",
                price: productElement.querySelector(".price") ? productElement.querySelector(".price").textContent : "₹0",
                category: productElement.getAttribute("data-category") || "N/A",
                shopFor: productElement.getAttribute("data-shop-for") || "N/A"
            };

            console.log("✅ Product details extracted:", product);

            // Add the product to wishlist
            addToWishlist(product);
        });
    });

    loadWishlist();
});

// Function to add an item to wishlist
function addToWishlist(item) {
    // Save locally first
    let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    const itemExists = wishlistItems.some(wishItem => wishItem.productName === item.productName);

    if (!itemExists) {
        wishlistItems.push(item);
        localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
        console.log("✅ Item added locally:", item);
        alert("Item added to wishlist!");

        // If user is logged in, store item in Firebase under users/<uid>/wishlist with a numeric index
        if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            const wishlistRef = ref(db, `users/${uid}/wishlist`);

            runTransaction(wishlistRef, (currentData) => {
                // Initialize currentData as an object if it doesn't exist
                if (currentData === null) {
                    currentData = {};
                }
                // Use number of existing keys as next index
                const nextIndex = Object.keys(currentData).length;
                currentData[nextIndex] = item;
                return currentData;
            }).then((result) => {
                if (result.committed) {
                    console.log("✅ Item stored in Firebase at index " + (Object.keys(result.snapshot.val()).length - 1));
                } else {
                    console.error("Transaction not committed.");
                }
            }).catch((error) => {
                console.error("❌ Transaction failed:", error);
                alert("Error saving item to database. Please try again.");
            });
        } else {
            alert("You're not logged in – wishlist saved locally only.");
        }
    } else {
        alert("Item is already in your wishlist!");
    }

    loadWishlist();
}

// Function to load and display wishlist items with fade-in animation
function loadWishlist() {
    const wishlistContainer = document.querySelector(".wishlist-container");
    if (!wishlistContainer) {
        console.error("❌ Wishlist container not found!");
        return;
    }

    let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    console.log("✅ Loading wishlist items:", wishlistItems);

    if (wishlistItems.length === 0) {
        wishlistContainer.innerHTML = "<p class='empty-wishlist'>Your wishlist is empty.</p>";
        return;
    }

    wishlistContainer.innerHTML = ""; // Clear existing items

    wishlistItems.forEach((item, index) => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("wishlist-item", "fade-in"); // Apply animation class
        itemDiv.innerHTML = `
      <img src="${item.imageSrc}" alt="${item.productName}">
      <div class="wishlist-info">
        <h4>${item.productName}</h4>
        <p class="wishlist-price">${item.price}</p>
        <p>Category: ${item.category}</p>
        <p>For: ${item.shopFor}</p>
        <button class="remove-wishlist" data-index="${index}">Remove</button>
      </div>
    `;
        wishlistContainer.appendChild(itemDiv);
    });

    // Attach remove event listeners
    document.querySelectorAll(".remove-wishlist").forEach(button => {
        button.addEventListener("click", function () {
            const index = parseInt(this.getAttribute("data-index"));
            removeFromWishlist(index);
        });
    });
}

// Function to remove an item from wishlist
function removeFromWishlist(index) {
    let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlistItems.splice(index, 1);
    localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
    loadWishlist();
}

// Reload wishlist on page load
document.addEventListener("DOMContentLoaded", loadWishlist);
