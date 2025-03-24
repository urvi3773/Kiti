import { initializeApp } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-auth.js";

// Replace with your actual Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    databaseURL: "YOUR_DATABASE_URL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// Check if the admin is authenticated
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Fetch all user data from the "users" node.
        // Make sure your Firebase rules allow this for the admin.
        const usersRef = ref(db, "users/");
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            renderUsers(data);
        }, (error) => {
            console.error("Error fetching users:", error);
        });
    } else {
        console.log("Not authenticated. Please log in as admin.");
        // Optionally, redirect to a login page.
    }
});

/**
 * Renders the list of users into the table.
 * @param {Object} data - Object of users fetched from Firebase.
 */
function renderUsers(data) {
    const userList = document.getElementById("user-list");
    userList.innerHTML = "";
    if (data) {
        // Use Object.keys to iterate over each uid in the users node.
        const keys = Object.keys(data);
        keys.forEach((uid, index) => {
            const user = data[uid];
            const tr = document.createElement("tr");
            tr.innerHTML = `
        <td>${index + 1}</td>
        <td>${user.firstName || "N/A"} ${user.lastName || ""}</td>
        <td>${user.email || "N/A"}</td>
        <td>${user.phoneNumber || "N/A"}</td>
        <td>
          <button class="btn edit-btn" onclick="editUser('${uid}')">Edit</button>
          <button class="btn delete-btn" onclick="deleteUser('${uid}')">Delete</button>
        </td>
      `;
            userList.appendChild(tr);
        });
    } else {
        userList.innerHTML = "<tr><td colspan='5'>No users found.</td></tr>";
    }
}

// Expose functions for edit and delete actions (to be implemented as needed)
window.editUser = function (uid) {
    // Store the selected uid for editing and redirect to usercrud.html
    localStorage.setItem("selectedUserUID", uid);
    window.location.href = "usercrud.html";
};

window.deleteUser = function (uid) {
    // Implement deletion logic (e.g., prompt and delete via Firebase's remove function)
    if (confirm("Are you sure you want to delete this user?")) {
        // Import remove from firebase-database if needed or add your deletion code here.
        // For example:
        import { remove } from "https://www.gstatic.com/firebasejs/11.3.1/firebase-database.js";
        const userRef = ref(db, "users/" + uid);
        remove(userRef)
            .then(() => {
                alert("User deleted successfully.");
            })
            .catch((error) => {
                console.error("Error deleting user:", error);
                alert("Failed to delete user.");
            });
    }
};
