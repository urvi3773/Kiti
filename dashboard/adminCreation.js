import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// Firebase configuration (from your Main_Login.js reference)
const firebaseConfig = {
    apiKey: "AIzaSyBktOyKU7CXxe_obLk0WCbQImAIPSldd1s",
    authDomain: "kiti-korean-store-c32ad.firebaseapp.com",
    projectId: "kiti-korean-store-c32ad",
    storageBucket: "kiti-korean-store-c32ad.firebasestorage.app",
    messagingSenderId: "917456056873",
    appId: "1:917456056873:web:389e0b5571f3277fb02238",
    databaseURL: "https://kiti-korean-store-c32ad-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Toggle forms
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
document.getElementById("showSignup").addEventListener("click", () => {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
});
document.getElementById("showLogin").addEventListener("click", () => {
    signupForm.classList.remove("active");
    loginForm.classList.add("active");
});

// Login logic
loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            alert("Logged in successfully as " + (user.displayName || user.email));
            // Redirect to admin dashboard (adjust URL as needed)
            window.location.href = "./index.html";
        })
        .catch((error) => {
            console.error("Login Error:", error);
            alert("Login failed: " + error.message);
        });
});

// Admin Sign-Up logic
signupForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const F_name = document.querySelector("#Fname").value.trim();
    const L_name = document.querySelector("#Lname").value.trim();
    const email = document.querySelector("#signupEmail").value.trim();
    const phoneNumber = document.querySelector("#phoneNumber").value.trim();
    const password = document.querySelector("#signupPassword").value;

    if (!F_name || !L_name || !email || !phoneNumber || !password) {
        alert("Please fill all fields before signing up!");
        return;
    }

    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const username = F_name + " " + L_name;
            updateProfile(user, { displayName: username })
                .then(() => {
                    return set(ref(db, "users/" + user.uid), {
                        firstName: F_name,
                        lastName: L_name,
                        email: email,
                        phoneNumber: phoneNumber,
                    });
                })
                .then(() => {
                    // Call a Cloud Function endpoint to set the admin claim.
                    // Replace with your actual Cloud Function URL.
                    return fetch("https://us-central1-yourproject.cloudfunctions.net/makeAdmin", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ uid: user.uid })
                    });
                })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Failed to set admin claim.");
                    }
                    alert("Admin account created successfully!");
                    window.location.href = "./index.html";
                })
                .catch((error) => {
                    console.error("Error during admin sign-up:", error);
                    alert("Error creating admin: " + error.message);
                });
        })
        .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
                alert("This email is already registered. Please use a different email or sign in.");
            } else {
                alert(error.message);
            }
            console.error("Signup Error:", error);
        });
});
