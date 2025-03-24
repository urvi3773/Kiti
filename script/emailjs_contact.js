// emailjs_contact.js

console.log("emailjs_contact.js loaded");
emailjs.init("-GVroUY5ZtAIpTO8F");

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("contact-form");
    if (!form) {
        console.error("contact-form not found!");
        return;
    }
    console.log("contact-form found:", form);

    // Grab input elements
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    // Log input changes for debugging
    if (nameInput) {
        nameInput.addEventListener("input", function () {
            console.log("Name changed to:", this.value);
        });
    }
    if (emailInput) {
        emailInput.addEventListener("input", function () {
            console.log("Email changed to:", this.value);
        });
    }
    if (messageInput) {
        messageInput.addEventListener("input", function () {
            console.log("Message changed to:", this.value);
        });
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("contact-form submit triggered");

        // Increase delay to ensure any autofill or asynchronous updates are complete
        setTimeout(function () {
            const name = nameInput ? nameInput.value.trim() : "";
            const email = emailInput ? emailInput.value.trim() : "";
            const message = messageInput ? messageInput.value.trim() : "";

            console.log("DEBUG - Name:", name, "Email:", email, "Message:", message);

            if (!name || !email || !message) {
                alert("Please fill in all fields before submitting.");
                return;
            }

            const submitButton = form.querySelector("button[type='submit']");
            submitButton.disabled = true;
            submitButton.textContent = "Sending...";

            const templateParams = {
                user_name: name,
                user_email: email,
                message: message,
            };

            emailjs.send("Kiti", "template_ocsg02k", templateParams)
                .then(function (response) {
                    console.log("SUCCESS!", response.status, response.text);
                    alert("Message sent successfully!");
                    form.reset();
                    submitButton.disabled = false;
                    submitButton.textContent = "Submit";
                })
                .catch(function (error) {
                    console.error("FAILED...", error);
                    alert("Failed to send the message. Please try again.");
                    submitButton.disabled = false;
                    submitButton.textContent = "Submit";
                });
        }, 500);
    });
});
