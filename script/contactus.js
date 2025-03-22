const form = document.getElementById("contact-form");
    const popup = document.getElementById("popup");
    const closePopupButton = document.getElementById("close-popup");

    form.addEventListener("submit", function (event) {
      event.preventDefault(); // Prevent form submission

      // Collect form data
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      if (name && email && message) {
        // Show the popup
        popup.style.display = "block";

        // Optionally, reset the form
        form.reset();
      } else {
        alert("Please fill in all fields.");
      }
    });

    closePopupButton.addEventListener("click", function () {
      popup.style.display = "none";
    });
  