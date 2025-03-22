import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, runTransaction, onValue, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Firebase configuration – ensure these settings match your project
const firebaseConfig = {
    apiKey: "AIzaSyBktOyKU7CXxe_obLk0WCbQImAIPSldd1s",
    authDomain: "kiti-korean-store-c32ad.firebaseapp.com",
    projectId: "kiti-korean-store-c32ad",
    storageBucket: "kiti-korean-store-c32ad.firebasestorage.app",
    messagingSenderId: "917456056873",
    appId: "1:917456056873:web:389e0b5571f3277fb02238",
    databaseURL: "https://kiti-korean-store-c32ad-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Utility: Calculate average rating from an array of numbers
function calculateAverageRating(ratings) {
    if (!ratings || ratings.length === 0) return 0;
    return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

// Utility: Generate exactly 5 star icons based on a rating (filled stars = gold, empty = gray)
function createStarIcons(rating) {
    let starsHTML = "";
    for (let i = 0; i < 5; i++) {
        if (i < rating) {
            starsHTML += `<svg class="star" viewBox="0 0 24 24" fill="#FFD700" width="20" height="20">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>`;
        } else {
            starsHTML += `<svg class="star" viewBox="0 0 24 24" fill="none" stroke="#A0A0A0" stroke-width="2" width="20" height="20">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>`;
        }
    }
    return starsHTML;
}

// Fetch reviews from Firebase filtered by productName
function fetchReviews(productName, callback) {
    const reviewsRef = ref(db, "reviews");
    onValue(reviewsRef, (snapshot) => {
        const data = snapshot.val() || {};
        const reviews = Object.values(data).filter(r => r.productName === productName);
        callback(reviews);
    }, (error) => {
        console.error("Error fetching reviews:", error);
        callback([]);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    // Create modal overlay if not already present
    let modal = document.getElementById("productModal");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "productModal";
        modal.className = "product-modal";
        Object.assign(modal.style, {
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "none",
            alignItems: "center",
            justifyContent: "center",
            zIndex: "9999"
        });
        // Modal content: Two-column layout – Left: product details & action buttons; Right: review form & reviews list.
        modal.innerHTML = `
      <div class="modal-content" style="background: #fff; border-radius: 8px; max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto; padding: 20px; margin: 20px; animation: fadeIn 0.5s;">
        <span class="close-button" style="cursor: pointer; float: right; font-size: 1.5rem; margin: 15px;">&times;</span>
        <div class="modal-columns" style="display: flex; gap: 20px; flex-wrap: wrap;">
          <!-- Left Column: Product Details & Action Buttons -->
          <div class="modal-left" style="flex: 1 1 300px; text-align: center; padding: 20px;">
            <img id="modalProductImage" src="" alt="Product Image" style="width: 100%; max-width: 350px; border-radius: 8px; margin-bottom: 10px;">
            <h2 id="modalProductName" style="margin: 10px 0; font-size: 1.8rem;"></h2>
            <p id="modalProductDescription" style="font-size: 1rem; color: #555; margin-bottom: 10px;">Product description goes here.</p>
            <div id="modalProductPrice" style="font-size: 1.2rem; color: #7c3aed; margin-bottom: 15px;"></div>
            <!-- Action Buttons (using in-modal IDs) -->
            <div class="product-actions" style="margin-top: 15px;">
              <button id="modalAddToCartButton" class="order-btn" style="padding: 10px 20px; background: #48BB78; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-right: 10px;">Add Cart</button>
              <button id="modalWishlistButton" class="wishlist-btn" style="width: fit-content; padding: 10px 20px; background: #F56565; color: #fff; border: none; border-radius: 4px; cursor: pointer;">Wishlist</button>
            </div>
          </div>
          <!-- Right Column: Reviews & Review Form -->
          <div class="modal-right" style="flex: 1 1 300px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <!-- Review Form (Top) -->
            <div id="reviewFormContainer" style="margin-bottom: 20px;"></div>
            <!-- Reviews List (Bottom) -->
            <div id="reviewsList" class="reviews-list" style="max-height: 250px; overflow-y: auto; border: 1px solid #ddd; padding: 15px; border-radius: 4px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); animation: slideIn 0.5s;">
              <!-- Reviews will be rendered here -->
            </div>
            <!-- Review Summary -->
            <div class="review-summary" style="margin-top: 10px; font-size: 0.9rem; color: #666; text-align: center;">
              <div id="modalProductRating" class="modal-rating" style="display: inline-block; margin-right: 10px;"></div>
              <span id="modalReviewCount" class="review-count">(0 reviews)</span>
            </div>
          </div>
        </div>
      </div>
    `;
        document.body.appendChild(modal);
    }

    let newReviewRating = 0;
    let newReviewComment = "";

    // Function to render the reviews list inside the modal
    function renderReviewsList(product, reviews) {
        const reviewsList = document.getElementById("reviewsList");
        if (!reviews || reviews.length === 0) {
            reviewsList.innerHTML = "<p style='text-align: center; color: #888;'>No reviews yet.</p>";
            return;
        }
        reviewsList.innerHTML = reviews.map(review => {
            const reviewStars = createStarIcons(review.rating);
            return `
        <div class="review-item" style="border: 1px solid #e0e0e0; border-radius: 4px; padding: 10px; margin-bottom: 10px; box-shadow: 0 1px 4px rgba(0,0,0,0.1); animation: fadeIn 0.5s;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <span class="reviewer-name" style="font-weight: bold;">${review.reviewer || "Anonymous"}</span>
            <span class="review-date" style="font-size: 0.85rem; color: #888;">${new Date(review.date).toLocaleDateString()}</span>
          </div>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 5px 0;">
          <div class="review-stars" style="text-align: center; margin-bottom: 5px;">${reviewStars}</div>
          <p class="review-comment" style="text-align: center; margin: 0;">${review.comment}</p>
        </div>
      `;
        }).join('');
    }

    // Function to render the review form (or login prompt if not logged in)
    function renderReviewForm() {
        const reviewFormContainer = document.getElementById("reviewFormContainer");
        if (!auth.currentUser) {
            reviewFormContainer.innerHTML = `
        <div style="padding: 15px; background: rgba(240,240,240,0.8); border: 1px solid #ccc; border-radius: 4px; text-align: center; cursor: pointer;" onclick="window.location.href='login.html'">
          <strong>Please log in to add your review</strong>
        </div>
      `;
        } else {
            reviewFormContainer.innerHTML = `
        <div class="review-form-content">
          <h3 style="text-align: center; margin-bottom: 10px;">Add Your Review</h3>
          <div class="review-rating-input" id="reviewRatingInput" style="text-align: center; margin-bottom: 10px;">
            ${createStarIcons(0)}
          </div>
          <textarea id="reviewComment" placeholder="Write your review here..." style="width: 100%; height: 80px; padding: 10px; border: 1px solid #ccc; border-radius: 4px; resize: vertical;"></textarea>
          <button id="submitReview" class="submit-button" style="width: 100%; padding: 10px 20px; background: #7c3aed; color: #fff; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">Submit Review</button>
        </div>
      `;
            const reviewRatingInput = document.getElementById("reviewRatingInput");
            reviewRatingInput.addEventListener("click", (e) => {
                const starElements = reviewRatingInput.querySelectorAll("svg.star");
                starElements.forEach((star, index) => {
                    if (star.contains(e.target)) {
                        newReviewRating = index + 1;
                    }
                });
                reviewRatingInput.innerHTML = createStarIcons(newReviewRating);
            });
            document.getElementById("reviewComment").addEventListener("input", (e) => {
                newReviewComment = e.target.value;
            });
            document.getElementById("submitReview").addEventListener("click", () => {
                if (newReviewRating === 0 || newReviewComment.trim() === "") {
                    alert("Please provide both a rating and a comment.");
                    return;
                }
                const reviewer = auth.currentUser.displayName || auth.currentUser.email;
                const review = {
                    productName: modal.currentProduct.productName,
                    rating: newReviewRating,
                    comment: newReviewComment.trim(),
                    reviewer: reviewer,
                    date: new Date().toISOString()
                };
                const reviewsRef = ref(db, "reviews");
                runTransaction(reviewsRef, (currentData) => {
                    if (currentData === null) currentData = {};
                    const nextIndex = Object.keys(currentData).length;
                    currentData[nextIndex] = review;
                    return currentData;
                })
                    .then((result) => {
                        if (result.committed) {
                            console.log("Review saved at index", Object.keys(result.snapshot.val()).length - 1);
                        } else {
                            console.error("Transaction not committed.");
                        }
                    })
                    .catch((error) => {
                        console.error("Error saving review to Firebase:", error);
                        alert("Error saving review. Please try again.");
                    });
                // Re-fetch reviews to update the modal display
                fetchReviews(modal.currentProduct.productName, (fetchedReviews) => {
                    modal.currentProduct.reviews = fetchedReviews;
                    const ratings = fetchedReviews.map(r => r.rating);
                    const avgRating = calculateAverageRating(ratings);
                    document.getElementById("modalProductRating").innerHTML = createStarIcons(avgRating);
                    document.getElementById("modalReviewCount").textContent = `(${fetchedReviews.length} review${fetchedReviews.length !== 1 ? 's' : ''})`;
                    renderReviewsList(modal.currentProduct, fetchedReviews);
                });
                newReviewRating = 0;
                newReviewComment = "";
                document.getElementById("reviewComment").value = "";
                reviewRatingInput.innerHTML = createStarIcons(0);
                alert("Review submitted!");
            });
        }
    }

    // -------------------- Modal Action Buttons --------------------

    // "Add Cart" button in modal – update cart and redirect
    document.getElementById("modalAddToCartButton")?.addEventListener("click", () => {
        if (!modal.currentProduct) return;
        const newItem = {
            productName: modal.currentProduct.productName,
            price: modal.currentProduct.price,
            imageSrc: modal.currentProduct.imageSrc,
            quantity: 1
        };
        let cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        cartItems.push(newItem);
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            const cartRef = ref(db, "users/" + uid + "/cartItems");
            set(cartRef, cartItems)
                .then(() => { console.log("Cart updated in Firebase."); })
                .catch((error) => { console.error("Error updating cart:", error); });
        }
        window.location.href = "../src/addcart.html";
    });

    // "Wishlist" button in modal – update wishlist (local storage only)
    document.getElementById("modalWishlistButton")?.addEventListener("click", () => {
        if (!modal.currentProduct) return;
        let wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];
        const exists = wishlistItems.some(item => item.productName === modal.currentProduct.productName);
        if (!exists) {
            wishlistItems.push(modal.currentProduct);
            localStorage.setItem("wishlist", JSON.stringify(wishlistItems));
            alert("Item added to wishlist!");
        } else {
            alert("Item is already in your wishlist!");
        }
    });

    // -------------------- Open/Close Modal and Product Click Handlers --------------------

    function openModal(product) {
        document.getElementById("modalProductImage").src = product.imageSrc;
        document.getElementById("modalProductName").textContent = product.productName;
        document.getElementById("modalProductDescription").textContent = product.description || "No description available.";
        document.getElementById("modalProductPrice").textContent = product.price;
        fetchReviews(product.productName, (fetchedReviews) => {
            product.reviews = fetchedReviews;
            const ratings = fetchedReviews.map(r => r.rating);
            const avgRating = calculateAverageRating(ratings);
            document.getElementById("modalProductRating").innerHTML = createStarIcons(avgRating);
            document.getElementById("modalReviewCount").textContent = `(${fetchedReviews.length} review${fetchedReviews.length !== 1 ? 's' : ''})`;
            renderReviewsList(product, fetchedReviews);
        });
        newReviewRating = 0;
        newReviewComment = "";
        if (document.getElementById("reviewComment")) {
            document.getElementById("reviewComment").value = "";
        }
        if (document.getElementById("reviewRatingInput")) {
            document.getElementById("reviewRatingInput").innerHTML = createStarIcons(0);
        }
        renderReviewForm();
        modal.currentProduct = product;
        modal.style.display = "flex";
    }

    function closeModal() {
        modal.style.display = "none";
    }

    modal.querySelector(".close-button").addEventListener("click", closeModal);
    window.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
    });

    // Attach click event listeners to each product item (".Jewellery-item")
    document.querySelectorAll(".Jewellery-item").forEach((item) => {
        item.addEventListener("click", (e) => {
            if (e.target.closest("button") || e.target.closest("a")) return;
            const imageEl = item.querySelector("img");
            const nameEl = item.querySelector("h4");
            const priceEl = item.querySelector(".price");
            const imageSrc = imageEl ? imageEl.src : "";
            const productName = nameEl ? nameEl.textContent : "Unknown Product";
            const price = priceEl ? priceEl.textContent : "₹0";
            const description = item.getAttribute("data-description") || "No description available.";
            let ratings = [];
            let reviews = [];
            try {
                ratings = JSON.parse(item.getAttribute("data-ratings") || "[]");
            } catch (e) {
                console.error("Error parsing ratings:", e);
            }
            try {
                reviews = JSON.parse(item.getAttribute("data-reviews") || "[]");
            } catch (e) {
                console.error("Error parsing reviews:", e);
            }
            const product = {
                imageSrc,
                productName,
                price,
                description,
                ratings,
                reviews
            };
            openModal(product);
        });
    });
});
