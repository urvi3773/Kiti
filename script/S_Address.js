import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getDatabase, ref, get, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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

// Helper function: Disable all address input fields
function disableAddressFields() {
    const fields = ["f_name", "l_name", "Address", "Add-2", "city", "country", "state", "pincode"];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.disabled = true;
            field.classList.add("in-Disable");
        }
    });
}

// Helper function: Enable all address input fields
function enableAddressFields() {
    const fields = ["f_name", "l_name", "Address", "Add-2", "city", "country", "state", "pincode"];
    fields.forEach(id => {
        const field = document.getElementById(id);
        if (field) {
            field.disabled = false;
            field.classList.remove("in-Disable");
        }
    });
}

// Function to fetch shipping address from Firebase and populate billing fields, then disable them
function fetchAndPopulateAddress() {
    if (!currentUser) {
        console.error("No authenticated user available.");
        return;
    }
    const uid = currentUser.uid;
    console.log("Fetching shipping address for UID:", uid);

    // Using billingAddress node as data source (change to shippingAddress if needed)
    const addressRef = ref(db, "users/" + uid + "/billingAddress");

    get(addressRef)
        .then((snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Shipping address data:", data);
                document.getElementById("f_name").value = data.firstName || "";
                document.getElementById("l_name").value = data.lastName || "";
                document.getElementById("Address").value = data.address || "";
                document.getElementById("Add-2").value = data.address2 || "";
                document.getElementById("city").value = data.city || "";
                document.getElementById("country").value = data.country || "";
                document.getElementById("state").value = data.state || "";
                document.getElementById("pincode").value = data.postalCode || "";
            } else {
                console.log("No shipping address found at path:", addressRef.toString());
            }
            // Disable fields so they become read-only
            disableAddressFields();
        })
        .catch((error) => {
            console.error("Error fetching shipping address:", error);
        });
}

// Function to store the billing address in Firebase Realtime Database
function storeBillingAddress() {
    const billingAddress = {
        firstName: document.getElementById("f_name").value.trim(),
        lastName: document.getElementById("l_name").value.trim(),
        address: document.getElementById("Address").value.trim(),
        address2: document.getElementById("Add-2").value.trim(),
        city: document.getElementById("city").value.trim(),
        country: document.getElementById("country").value.trim(),
        state: document.getElementById("state").value.trim(),
        postalCode: document.getElementById("pincode").value.trim()
    };

    console.log("Storing billing address:", billingAddress);

    if (!currentUser) {
        console.error("Cannot store billing address: no authenticated user.");
        return;
    }

    const uid = currentUser.uid;
    set(ref(db, "users/" + uid + "/billingAddress"), billingAddress)
        .then(() => {
            console.log("Billing address saved successfully in Firebase!");
            // Redirect only after the write is complete
            window.location.href = "./gift.html";
        })
        .catch((error) => {
            console.error("Error saving billing address in Firebase:", error);
        });
}

// Set up event listeners when DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    const sameRadio = document.querySelector('input[name="Address_option"][value="same"]');
    const diffRadio = document.querySelector('input[name="Address_option"][value="different"]');

    // When "Same as Shipping Address" is selected, fetch data and disable the fields
    if (sameRadio) {
        sameRadio.addEventListener("change", (e) => {
            if (e.target.checked) {
                fetchAndPopulateAddress();
            }
        });
    }
    // When "Different" is selected, clear fields and enable editing
    if (diffRadio) {
        diffRadio.addEventListener("change", (e) => {
            if (e.target.checked) {
                // Clear the fields
                document.getElementById("f_name").value = "";
                document.getElementById("l_name").value = "";
                document.getElementById("Address").value = "";
                document.getElementById("Add-2").value = "";
                document.getElementById("city").value = "";
                document.getElementById("country").value = "";
                document.getElementById("state").value = "";
                document.getElementById("pincode").value = "";
                // Enable fields for editing
                enableAddressFields();
            }
        });
    }
    // If by default "Same as Shipping Address" is selected, fetch data immediately
    if (sameRadio && sameRadio.checked) {
        fetchAndPopulateAddress();
    }

    // Set up listener for form submission to store the billing address
    const nextBtn = document.querySelector(".form_btn");
    if (nextBtn) {
        nextBtn.addEventListener("click", (e) => {
            e.preventDefault();
            storeBillingAddress();
        });
    }
});
