// final.js - Combined functionality for authentication, local storage, form toggle, and admin access check

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
import {
    getDatabase,
    ref,
    set,
    get
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

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

// Initialize Firebase app & services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// Initialize EmailJS (Replace with your actual EmailJS user ID)
emailjs.init("-GVroUY5ZtAIpTO8F");

// Local storage key for storing last user index
const LOCAL_INDEX_KEY = "lastUserIndex";

// Helper: Store user data locally
function storeUserLocally(userData) {
    localStorage.setItem("currentUser", JSON.stringify(userData));
}

// Helper: Retrieve last user index from localStorage or from DB if not cached
function getLastUserIndex() {
    let localIndex = localStorage.getItem(LOCAL_INDEX_KEY);
    if (localIndex !== null) {
        return Promise.resolve(Number(localIndex));
    }
    const usersRef = ref(db, "users");
    return get(usersRef).then(snapshot => {
        const count = snapshot.exists() ? snapshot.numChildren() : 0;
        localStorage.setItem(LOCAL_INDEX_KEY, count);
        return count;
    });
}

// Toggle forms for adminCreation.html
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const showSignup = document.getElementById("showSignup");
    const showLogin = document.getElementById("showLogin");

    // Ensure initial state: login form visible, signup form hidden
    if (loginForm && signupForm) {
        loginForm.classList.add("active");
        signupForm.classList.remove("active");
    }

    if (showSignup) {
        showSignup.addEventListener("click", () => {
            if (loginForm && signupForm) {
                loginForm.classList.remove("active");
                signupForm.classList.add("active");
            }
        });
    }

    if (showLogin) {
        showLogin.addEventListener("click", () => {
            if (loginForm && signupForm) {
                signupForm.classList.remove("active");
                loginForm.classList.add("active");
            }
        });
    }
});

// Signup Function (for regular users)
// Stores new user under "users/<sequentialIndex>" and caches data locally
function Sign_up() {
    const signupBtn = document.querySelector("#SignUp_Btn");
    if (!signupBtn) return;

    signupBtn.addEventListener("click", function (e) {
        e.preventDefault();

        const F_name = document.querySelector("#Fname").value.trim();
        const L_name = document.querySelector("#Lname").value.trim();
        const email = document.querySelector("#email").value.trim();
        const phoneNumber = document.querySelector("#phoneNumber").value.trim();
        const password = document.querySelector("#password").value;

        // Retrieve gender if available (for Create Admin Account form)
        let gender = null;
        const genderOptions = document.querySelectorAll('input[name="gender"]');
        if (genderOptions.length) {
            for (const option of genderOptions) {
                if (option.checked) {
                    gender = option.value;
                    break;
                }
            }
        }

        // Check that all required fields are filled:
        // (If there are gender options, ensure one is selected)
        if (!F_name || !L_name || !email || !phoneNumber || !password || (genderOptions.length && !gender)) {
            alert("Please fill in all fields in the Create Admin Account form!");
            return;
        }

        // Field validations
        const nameRegex = /^[A-Za-z\s]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

        if (!nameRegex.test(F_name)) {
            alert("First name must contain only letters and spaces.");
            return;
        }
        if (!nameRegex.test(L_name)) {
            alert("Last name must contain only letters and spaces.");
            return;
        }
        if (!passwordRegex.test(password)) {
            alert("Password must be at least 8 characters and include uppercase, lowercase, and a number.");
            return;
        }
        if (!phoneRegex.test(phoneNumber)) {
            alert("Phone number must contain exactly 10 digits.");
            return;
        }

        // Create user with Firebase Authentication
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const username = F_name + " " + L_name;
                return updateProfile(user, { displayName: username })
                    .then(() => getLastUserIndex())
                    .then((lastIndex) => {
                        const newIndex = lastIndex + 1;
                        localStorage.setItem(LOCAL_INDEX_KEY, newIndex);
                        const userData = {
                            uid: user.uid,
                            firstName: F_name,
                            lastName: L_name,
                            email: email,
                            phoneNumber: phoneNumber,
                            ...(gender && { gender: gender }),
                            index: newIndex
                        };
                        storeUserLocally(userData);
                        return set(ref(db, "users/" + newIndex), userData);
                    })
                    .then(() => {
                        alert("Signup successful and data stored!");
                        window.location.href = "./../index.html";
                    });
            })
            .catch((error) => {
                console.error("Signup Error: ", error);
                alert(error.message);
            });
    });
}

// Sign In Function
function Sign_in() {
    const submitBtn = document.querySelector("#Submit");
    if (!submitBtn) return;

    submitBtn.addEventListener("click", function (e) {
        e.preventDefault();
        const email = document.querySelector("#userInput").value.trim();
        const password = document.querySelector("#passwordInput").value;

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                const username = user.displayName || user.email;
                storeUserLocally({
                    uid: user.uid,
                    displayName: user.displayName,
                    email: user.email
                });
                alert("Logged in successfully as " + username);
                window.location.href = "./../index.html";
            })
            .catch((error) => {
                console.error("Login Error: ", error);
                alert("Login failed: " + error.message);
            });
    });
}

// Forgot Password Function
function Forgot_password() {
    const forgotForm = document.getElementById("forgotPasswordForm");
    if (!forgotForm) return;

    forgotForm.addEventListener("submit", function (e) {
        e.preventDefault();
        const email = document.getElementById("resetEmail").value.trim();
        if (!email) {
            alert("Please enter your email address.");
            return;
        }
        sendPasswordResetEmail(auth, email)
            .then(() => {
                alert("Password reset email sent. Check your inbox.");
                forgotForm.reset();
            })
            .catch((error) => {
                console.error("Error sending password reset email:", error);
                alert("Error: " + error.message);
            });
    });
}

// EmailJS Message Function
// function EmailJS_Message() {
//     const form = document.getElementById("messageForm");
//     if (!form) return;
//     const button = form.querySelector("button[type='submit']");

//     form.addEventListener("submit", function (e) {
//         e.preventDefault();
//         const emailValue = document.getElementById("userEmail").value.trim();
//         if (!emailValue) {
//             alert("Please enter an email.");
//             return;
//         }
//         button.disabled = true;
//         button.innerHTML = '<i class="fa fa-paper-plane"></i> Sending...';

//         let user = auth.currentUser;
//         let templateParams = {
//             message: emailValue,
//             user_email: user ? user.email : "",
//             user_name: user ? (user.displayName || user.email) : ""
//         };

//         emailjs.send("Kiti", "template_ocsg02k", templateParams)
//             .then(function (response) {
//                 alert("Message sent successfully!");
//                 form.reset();
//                 button.disabled = false;
//                 button.innerHTML = '<i class="fa fa-paper-plane"></i>';
//             }, function (error) {
//                 alert("Failed to send the message. Please try again.");
//                 button.disabled = false;
//                 button.innerHTML = '<i class="fa fa-paper-plane"></i>';
//             });
//     });
// }

// Admin Access Check:
// On pages (except adminCreation.html), verify if the current user is an admin.
// If not, redirect to adminCreation.html.
if (!window.location.href.includes("adminCreation.html")) {
    auth.onAuthStateChanged((user) => {
        if (user) {
            const adminRef = ref(db, "admins/" + user.uid);
            get(adminRef).then(snapshot => {
                if (!snapshot.exists()) {
                    window.location.href = "./adminCreation.html";
                }
            }).catch((error) => {
                console.error("Error checking admin access:", error);
                window.location.href = "./adminCreation.html";
            });
        } else {
            window.location.href = "./adminCreation.html";
        }
    });
}

// Initialize event listeners if elements exist
if (document.querySelector("#SignUp_Btn")) {
    Sign_up();
}
if (document.querySelector("#Submit")) {
    Sign_in();
}
if (document.getElementById("forgotPasswordForm")) {
    Forgot_password();
}
if (document.getElementById("messageForm")) {
    EmailJS_Message();
}
