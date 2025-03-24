import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, set, get, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBktOyKU7CXxe_obLk0WCbQImAIPSldd1s",
    authDomain: "kiti-korean-store-c32ad.firebaseapp.com",
    projectId: "kiti-korean-store-c32ad",
    storageBucket: "kiti-korean-store-c32ad.firebasestorage.app",
    messagingSenderId: "917456056873",
    appId: "1:917456056873:web:389e0b5571f3277fb02238",
    databaseURL: "https://kiti-korean-store-c32ad-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase and Database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Variables to store existing image and description (in edit mode)
let existingImageData = null;
let existingDescription = "";

/**
 * Display a popup notification on the page that lasts for 5 seconds.
 * @param {string} message - The message to display.
 */
function showNotification(message) {
    const notificationEl = document.getElementById("notification");
    notificationEl.innerText = message;
    notificationEl.classList.add("show");
    setTimeout(() => {
        notificationEl.classList.remove("show");
    }, 5000);
}

// Check if a product key was saved in localStorage (for edit mode)
let selectedProductKey = localStorage.getItem("selectedProductKey");

if (selectedProductKey) {
    document.getElementById("product-image").removeAttribute("required");
    const productRef = ref(db, "products/" + selectedProductKey);
    get(productRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const product = snapshot.val();
                document.getElementById("product-name").value = product.name;
                document.getElementById("product-price").value = product.price;
                document.getElementById("product-description").value = product.description || "";
                existingImageData = product.image;
                existingDescription = product.description || "";
                showNotification("Product loaded for update. Modify fields as needed.");
            } else {
                console.error("No product data found for key:", selectedProductKey);
            }
        })
        .catch((error) => console.error("Error fetching product:", error));
}

const productForm = document.getElementById("product-form");

productForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("product-name").value;
    const price = document.getElementById("product-price").value;
    const descriptionInput = document.getElementById("product-description").value;
    const imageInput = document.getElementById("product-image");
    const imageFile = imageInput.files[0];

    if (!selectedProductKey && !imageFile) {
        showNotification("Please select an image file.");
        return;
    }

    const updateProduct = (imageData) => {
        const description = descriptionInput ? descriptionInput : existingDescription;
        if (!selectedProductKey) {
            const productsRef = ref(db, "products/");
            get(productsRef)
                .then((snapshot) => {
                    let newIndex;
                    if (snapshot.exists()) {
                        const data = snapshot.val();
                        const keys = Object.keys(data).map(Number);
                        newIndex = keys.length > 0 ? Math.max(...keys) + 1 : 1;
                    } else {
                        newIndex = 1;
                    }
                    set(ref(db, "products/" + newIndex), {
                        name: name,
                        price: parseFloat(price),
                        description: description,
                        image: imageData
                    })
                        .then(() => {
                            showNotification("Product inserted successfully.");
                            setTimeout(() => {
                                window.location.href = "product.html";
                            }, 5000);
                        })
                        .catch((error) => {
                            console.error("Error inserting product:", error);
                            showNotification("Error inserting product.");
                        });
                })
                .catch((error) => {
                    console.error("Error reading products:", error);
                    showNotification("Error reading products.");
                });
        } else {
            const productRef = ref(db, "products/" + selectedProductKey);
            set(productRef, {
                name: name,
                price: parseFloat(price),
                description: description,
                image: imageData
            })
                .then(() => {
                    showNotification("Product updated successfully.");
                    localStorage.removeItem("selectedProductKey");
                    setTimeout(() => {
                        window.location.href = "product.html";
                    }, 5000);
                })
                .catch((error) => {
                    console.error("Error updating product:", error);
                    showNotification("Error updating product.");
                });
        }
    };

    if (imageFile) {
        const reader = new FileReader();
        reader.onload = function (e) {
            updateProduct(e.target.result);
        };
        reader.readAsDataURL(imageFile);
    } else {
        updateProduct(existingImageData);
    }
});

// Update button: trigger form submission if editing.
document.getElementById("update-btn").addEventListener("click", function () {
    if (!selectedProductKey) {
        showNotification('Select a product to update by clicking "Edit" on the Product List page.');
    } else {
        productForm.dispatchEvent(new Event("submit"));
    }
});

// Delete button: remove product if editing.
document.getElementById("delete-btn").addEventListener("click", function () {
    if (!selectedProductKey) {
        showNotification('Select a product to delete by clicking "Edit" on the Product List page.');
    } else {
        if (confirm("Are you sure you want to delete this product?")) {
            const productRef = ref(db, "products/" + selectedProductKey);
            remove(productRef)
                .then(() => {
                    showNotification("Product deleted successfully.");
                    localStorage.removeItem("selectedProductKey");
                    setTimeout(() => {
                        window.location.href = "product.html";
                    }, 5000);
                })
                .catch((error) => {
                    console.error("Error deleting product:", error);
                    showNotification("Error deleting product.");
                });
        }
    }
});
