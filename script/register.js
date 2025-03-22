function Main_4() {

function showPopup(message, isSuccess) {
    const popup = document.getElementById('popup');
    const overlay = document.getElementById('overlay');
    popup.textContent = message;
    popup.style.color = isSuccess ? 'green' : 'red';
    popup.style.display = 'block';
    overlay.style.display = 'block';

    setTimeout(() => {
        popup.style.display = 'none';
        overlay.style.display = 'none';
    }, 3000);
}


function submitForm(event) {
    event.preventDefault();

    const mobileInput = document.querySelector('[placeholder="Mobile Number"]');
    const emailInput = document.querySelector('[placeholder="Enter Email"]');
    const firstNameInput = document.querySelector('[placeholder="First Name"]');
    const lastNameInput = document.querySelector('[placeholder="Last Name"]');
    const genderInputs = document.querySelectorAll('[name="gender"]');

    let isGenderSelected = false;
    genderInputs.forEach(input => {
        if (input.checked) {
            isGenderSelected = true;
        }
    });

    if (
        !mobileInput.value ||
        !emailInput.value ||
        !firstNameInput.value ||
        !lastNameInput.value ||
        !isGenderSelected
    ) {
        showPopup('Please fill all the fields correctly!', false);
    } else {
        showPopup('Registered successfully!', true);
    }
}

function redirectToGoogle() {
    window.location.href = "https://www.google.com";
}

function redirectToFacebook() {
    window.location.href = "https://www.facebook.com";
}

function redirectToLogin() {
    window.location.href = "#login";
}

}