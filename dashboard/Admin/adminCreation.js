// FINAL.JS - Combined authentication and admin access check

import {
    initializeApp
} from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
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
// emailjs.init("-GVroUY5ZtAIpTO8F");

// Key for storing last user index locally
const LOCAL_INDEX_KEY = "lastUserIndex";

// Helper: Store user data locally
function storeUserLocally(userData) {
    localStorage.setItem("currentUser", JSON.stringify(userData));
}

// Helper: Retrieve last user index from localStorage or from the DB (if not cached)
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

// Check Admin Access: if user is not admin, redirect to adminCreation.html
function checkAdminAccess() {
    const user = auth.currentUser;
    if (!user) {
        // No user is logged in, redirect to adminCreation.html
        window.location.href = "./Admin/adminCreation.html";
        return;
    }
    // Assume admin data is stored under "admins/<uid>"
    const adminRef = ref(db, "admins/" + user.uid);
    get(adminRef).then(snapshot => {
        if (!snapshot.exists()) {
            // If no admin record, user is not an admin – redirect.
            window.location.href = "./Admin/adminCreation.html";
        }
    }).catch((error) => {
        console.error("Error checking admin access:", error);
        // On error, you may choose to redirect as well
        window.location.href = "./Admin/adminCreation.html";
    });
}

// Signup Function for Regular Users (stores user under "users" with sequential index)
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

        // Get selected gender
        const genderOptions = document.querySelectorAll('input[name="gender"]');
        let gender = null;
        for (const option of genderOptions) {
            if (option.checked) {
                gender = option.value;
                break;
            }
        }

        if (!F_name || !L_name || !email || !phoneNumber || !password || !gender) {
            alert("Please fill all fields before signing up!");
            return;
        }

        // Validate fields with regex
        const nameRegex = /^[A-Za-z\s]+$/;
        const phoneRegex = /^[0-9]{10}$/;
        const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;

        if (!nameRegex.test(F_name)) {
            alert("First name must contain only letters (and spaces).");
            return;
        }
        if (!nameRegex.test(L_name)) {
            alert("Last name must contain only letters (and spaces).");
            return;
        }
        if (!passwordRegex.test(password)) {
            alert("Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, and a number.");
            return;
        }
        if (!phoneRegex.test(phoneNumber)) {
            alert("Phone number must contain exactly 10 digits.");
            return;
        }

        // Create user with Firebase Auth
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
                            gender: gender,
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
                alert("Password reset email sent. Please check your inbox.");
                forgotForm.reset();
            })
            .catch((error) => {
                console.error("Error sending password reset email:", error);
                alert("Error: " + error.message);
            });
    });
}

// EmailJS Message Submission Function
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

// Check admin access on pages that require admin privileges
// For example, if the current page is not adminCreation.html, then verify admin status
if (!window.location.href.includes("adminCreation.html")) {
    // Wait for auth to be ready
    auth.onAuthStateChanged((user) => {
        if (user) {
            // Check if user is admin by looking under "admins/<uid>"
            const adminRef = ref(db, "admins/" + user.uid);
            get(adminRef).then(snapshot => {
                if (!snapshot.exists()) {
                    // Not an admin: redirect to adminCreation.html
                    window.location.href = "./Admin/adminCreation.html";
                }
            }).catch((error) => {
                console.error("Error checking admin access:", error);
                window.location.href = "./Admin/adminCreation.html";
            });
        } else {
            // No user logged in, redirect to adminCreation.html (or a login page)
            window.location.href = "./Admin/adminCreation.html";
        }
    });
}
