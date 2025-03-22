

function login() {
  const userInput = document.getElementById('userInput').value;
  if (userInput.trim() === '') {
    alert('Please enter your mobile number or email.');
  } else {
    alert(`Proceeding with: ${userInput}`);
  }
}

// function googleLoginPopup() {
//   alert('Google Login is not implemented yet.');
// }

// function facebookLoginPopup() {
//   alert('Facebook Login is not implemented yet.');
// }

// function termsPopup() {
//   alert('Terms and Conditions popup is not implemented yet.');
// }

// function privacyPopup() {
//   alert('Privacy Policy popup is not implemented yet.');
// }

document.getElementById("forgotPasswordForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const email = document.getElementById("resetEmail").value;
  const message = document.getElementById("resetMessage");

  if (email) {
    message.style.color = "green";
    message.textContent = "Password reset link has been sent to your email!";
  } else {
    message.style.color = "red";
    message.textContent = "Please enter a valid email address.";
  }
});