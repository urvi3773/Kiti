// productList.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

/**
 * Fetch products from Firebase Realtime Database.
 * @param {function} callback - Function to call with the fetched data.
 */
function fetchProducts(callback) {
    const productsRef = ref(db, "products/");
    onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            // Sort keys numerically so they appear in index order
            const sortedKeys = Object.keys(data).sort((a, b) => Number(a) - Number(b));
            const sortedData = {};
            sortedKeys.forEach(key => {
                sortedData[key] = data[key];
            });
            callback(sortedData);
        } else {
            callback(null);
        }
    });
}

/**
 * Delete a product from Firebase Realtime Database.
 * @param {string} productKey - The numeric key of the product to delete.
 * @returns {Promise} Promise that resolves when deletion is complete.
 */
function deleteProduct(productKey) {
    const productRef = ref(db, "products/" + productKey);
    return remove(productRef);
}

/**
 * Renders the product list in the table.
 * @param {Object} products - Object of products from Firebase.
 */
function renderProducts(products) {
    const productList = document.getElementById("product-list");
    if (!productList) {
        console.error("Product list container not found.");
        return;
    }
    productList.innerHTML = "";
    if (products) {
        Object.keys(products).forEach((key) => {
            const product = products[key];
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${key}</td>
        <td>${product.name}</td>
        <td>${product.description || ""}</td>
        <td>₹${parseFloat(product.price).toFixed(2)}</td>
        <td><img src="${product.image}" alt="${product.name}" width="50"></td>
        <td>
          <button class="btn edit-btn" onclick="editProduct('${key}')">Edit</button>
          <button class="btn delete-btn" onclick="deleteProductHandler('${key}')">Delete</button>
        </td>
      `;
            productList.appendChild(tr);
        });
    } else {
        productList.innerHTML = "<tr><td colspan='6'>No products found.</td></tr>";
    }
}

/**
 * Attaches search functionality to filter the product list.
 */
function searchProduct() {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    const rows = document.querySelectorAll("#product-list tr");
    rows.forEach((row) => {
        const productName = row.cells[1].innerText.toLowerCase();
        row.style.display = productName.includes(searchValue) ? "" : "none";
    });
}

/**
 * Stores the selected product key and redirects to the CRUD page.
 * @param {string} productKey - The numeric key of the product to edit.
 */
function editProduct(productKey) {
    localStorage.setItem("selectedProductKey", productKey);
    window.location.href = "productcrud.html";
}

/**
 * Deletes the product and shows alerts based on the result.
 * @param {string} productKey - The numeric key of the product to delete.
 */
function deleteProductHandler(productKey) {
    if (confirm("Are you sure you want to delete this product?")) {
        deleteProduct(productKey)
            .then(() => {
                alert("Product deleted successfully.");
            })
            .catch((error) => {
                console.error("Error deleting product:", error);
                alert("Failed to delete the product.");
            });
    }
}

/**
 * Attaches sidebar toggle functionality.
 */
function setupSidebarToggle() {
    const fixedToggle = document.getElementById("fixed-toggle");
    fixedToggle.addEventListener("click", function () {
        document.getElementById("sidebar").classList.toggle("collapsed");
        this.classList.toggle("collapsed");
    });
}

/**
 * Initializes the product listing page functionalities.
 */
export function initProductPage() {
    // Expose functions so that inline onclick attributes work
    window.searchProduct = searchProduct;
    window.editProduct = editProduct;
    window.deleteProductHandler = deleteProductHandler;

    setupSidebarToggle();
    // Fetch and render products on page load
    fetchProducts(renderProducts);
}

// Initialize on page load
initProductPage();
