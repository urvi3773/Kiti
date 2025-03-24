// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
// import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";
// import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBktOyKU7CXxe_obLk0WCbQImAIPSldd1s",
//   authDomain: "kiti-korean-store-c32ad.firebaseapp.com",
//   projectId: "kiti-korean-store-c32ad",
//   storageBucket: "kiti-korean-store-c32ad.firebasestorage.app",
//   messagingSenderId: "917456056873",
//   appId: "1:917456056873:web:389e0b5571f3277fb02238",
//   databaseURL: "https://kiti-korean-store-c32ad-default-rtdb.asia-southeast1.firebasedatabase.app/"

// };

// // Step 3: Initialize Firebase app & Firebase Auth
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// const db = getDatabase(app); // Initialize Realtime Database

// function Sign_up() {
//   const signup = document.querySelector("#SignUp_Btn");

//   signup.addEventListener("click", function (e) {
//     e.preventDefault(); // Prevents form from refreshing

//     const F_name = document.querySelector("#Fname").value;
//     const L_name = document.querySelector("#Lname").value;
//     const email = document.querySelector("#email").value;
//     const phoneNumber = document.querySelector("#phoneNumber").value; // Fixed ID
//     const password = document.querySelector("#password").value;

//     // Get the selected gender
//     const genderOptions = document.querySelectorAll('input[name="gender"]');
//     let gender = null;
//     for (const option of genderOptions) {
//       if (option.checked) {
//         gender = option.value;
//         break;
//       }
//     }

//     // Validate input fields
//     if (!F_name || !L_name || !email || !phoneNumber || !password || !gender) {
//       alert("Please fill all fields before signing up!");
//       return;
//     }

//     // Firebase Sign Up
//     createUserWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         const user = userCredential.user;

//         // Store extra user data in Firebase Database
//         set(ref(db, "users/" + user.uid), {
//           firstName: F_name,
//           lastName: L_name,
//           email: email,
//           phoneNumber: phoneNumber,
//           gender: gender,
//         });

//         alert("Signup successful!");
//         window.location.href = "login.html"; // Redirect to login page
//       })
//       .catch((error) => {
//         console.error(error);
//         alert(error.message);
//       });
//   });
// }

// function Sign_in() {
//   // Step 5: Handle form submission for user login

//   const submit = document.querySelector("#Submit");
//   submit.addEventListener("click", function (e) {
//     e.preventDefault();  // Prevent form submission

//     // Get email and password values
//     const email = document.querySelector("#userInput").value;
//     const password = document.querySelector("#passwordInput").value;

//     // Step 6: Login with email and password
//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         // Logged in successfully
//         const user = userCredential.user;
//         alert("Logged in successfully as " + user.displayName + " || " + user.email);
//         console.log("Logged in as: " + user.email);

//         // Optionally, you can fetch additional user details or update Firestore here
//       })
//       .catch((error) => {
//         const errorMessage = error.message;
//         alert(errorMessage);  // Show error if any
//         console.log(errorMessage);
//       });
//   });
// }

// // Call the function
// if (document.querySelector("#SignUp_Btn")) {
//   Sign_up();
// }

// if (document.querySelector("#Submit")) {
//   Sign_in();
// }

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
  set
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

// Helper function to store user data locally
function storeUserLocally(user) {
  // Create an object with basic user details
  const currentUser = {
    uid: user.uid,
    displayName: user.displayName,
    email: user.email
  };
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
}

// Signup Function
function Sign_up() {
  const signup = document.querySelector("#SignUp_Btn");
  if (!signup) return;

  signup.addEventListener("click", function (e) {
    e.preventDefault();

    const F_name = document.querySelector("#Fname").value.trim();
    const L_name = document.querySelector("#Lname").value.trim();
    const email = document.querySelector("#email").value.trim();
    const phoneNumber = document.querySelector("#phoneNumber").value.trim();
    const password = document.querySelector("#password").value;

    // Get the selected gender
    const genderOptions = document.querySelectorAll('input[name="gender"]');
    let gender = null;
    for (const option of genderOptions) {
      if (option.checked) {
        gender = option.value;
        break;
      }
    }

    // Validate input fields
    if (!F_name || !L_name || !email || !phoneNumber || !password || !gender) {
      alert("Please fill all fields before signing up!");
      return;
    }

    // Regular expressions for validation
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

    // Create user with Firebase Authentication
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const username = F_name + " " + L_name;
        // Update the user profile with the display name
        updateProfile(user, { displayName: username })
          .then(() => {
            // Store extra user data in the Realtime Database
            return set(ref(db, "users/" + user.uid), {
              firstName: F_name,
              lastName: L_name,
              email: email,
              phoneNumber: phoneNumber,
              gender: gender,
            });
          })
          .then(() => {
            // Store user data locally
            storeUserLocally(user);
            alert("Signup successful and data stored!");
            // Redirect to index.html after signup
            window.location.href = "./../index.html";
          })
          .catch((error) => {
            console.error("Error storing data or updating profile: ", error);
            alert("Failed to store user data. Please try again.");
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
  const submit = document.querySelector("#Submit");
  if (!submit) return;

  submit.addEventListener("click", function (e) {
    e.preventDefault();

    const email = document.querySelector("#userInput").value.trim();
    const password = document.querySelector("#passwordInput").value;

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const username = user.displayName || user.email;
        // Store user data locally
        storeUserLocally(user);
        alert("Logged in successfully as " + username);
        // Redirect to index.html after login
        window.location.href = "./../index.html";
      })
      .catch((error) => {
        alert("Login failed: " + error.message);
        console.error("Login Error: ", error);
      });
  });
}

// Forgot Password Function
function Forgot_password() {
  const forgotForm = document.getElementById("forgotPasswordForm");
  if (!forgotForm) {
    console.error("Forgot password form not found!");
    return;
  }

  forgotForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const email = document.getElementById("resetEmail").value.trim();

    if (!email) {
      alert("Please enter your email address.");
      return;
    }

    console.log("Sending password reset email to:", email);
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

// EmailJS Message Form Submission Function with Current Logged-In User
function EmailJS_Message() {
  const form = document.getElementById("messageForm");
  if (!form) return;
  const button = form.querySelector("button[type='submit']");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Get the value from the input
    const emailValue = document.getElementById("userEmail").value.trim();
    if (!emailValue) {
      alert("Please enter an email.");
      return;
    }
    button.disabled = true;
    button.innerHTML = '<i class="fa fa-paper-plane"></i> Sending...';

    // Get the current logged in user from Firebase Auth
    let user = auth.currentUser;
    let templateParams = {
      message: emailValue,
      user_email: user ? user.email : "",
      user_name: user ? (user.displayName || user.email) : ""
    };

    console.log("Current user:", user ? user : "No User");
    console.log("Template Params:", templateParams);

    emailjs.send("Kiti", "template_ocsg02k", templateParams)
      .then(function (response) {
        console.log("SUCCESS!", response.status, response.text);
        alert("Message sent successfully!");
        form.reset();
        button.disabled = false;
        button.innerHTML = '<i class="fa fa-paper-plane"></i>';
      }, function (error) {
        console.error("FAILED...", error);
        alert("Failed to send the message. Please try again.");
        button.disabled = false;
        button.innerHTML = '<i class="fa fa-paper-plane"></i>';
      });
  });
}

// Initialize event listeners if the corresponding elements exist
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

