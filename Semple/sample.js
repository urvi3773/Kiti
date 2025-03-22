// Comprehensive Gujarat PIN code dataset with unique keys
const gujaratPincodeData = {
    "380001": { city: "Ahmedabad", area: "Primary", state: "Gujarat" },
    "395003": { city: "Surat", area: "Primary", state: "Gujarat" },
    "390001": { city: "Vadodara", area: "Primary", state: "Gujarat" },
    "360001": { city: "Rajkot", area: "Primary", state: "Gujarat" },
    "364001": { city: "Bhavnagar", area: "Primary", state: "Gujarat" },
    "361001": { city: "Jamnagar", area: "Primary", state: "Gujarat" },
    "362001": { city: "Junagadh", area: "Primary", state: "Gujarat" },
    "382010": { city: "Gandhinagar", area: "Primary", state: "Gujarat" },
    "388001": { city: "Anand", area: "Primary", state: "Gujarat" },
    "396445": { city: "Navsari", area: "Primary", state: "Gujarat" },
    "387001": { city: "Nadiad", area: "Primary", state: "Gujarat" },
    "370201": { city: "Gandhidham", area: "Primary", state: "Gujarat" },

    // Surat area PIN codes
    "395001": { city: "Surat", area: ["Athwalines", "Nanpura"], state: "Gujarat" },
    "395002": { city: "Surat", area: ["Majura Gate", "Ring Road"], state: "Gujarat" },
    "395004": { city: "Surat", area: "Katargam", state: "Gujarat" },
    "395005": { city: "Surat", area: "Rander", state: "Gujarat" },
    "395006": { city: "Surat", area: "Varachha Road", state: "Gujarat" },
    "395007": { city: "Surat", area: ["Athwa", "Bhatar", "Citylight", "Ghod Dod Road", "Piplod", "Vesu"], state: "Gujarat" },
    "395009": { city: "Surat", area: ["Adajan Dn", "Palanpur Patia"], state: "Gujarat" },
    "395010": { city: "Surat", area: "Parvat Patiya", state: "Gujarat" },
    "394107": { city: "Surat", area: "Amroli", state: "Gujarat" },
    "394210": { city: "Surat", area: "Udhna", state: "Gujarat" },
    "394221": { city: "Surat", area: "Pandesara", state: "Gujarat" },
    "394230": { city: "Surat", area: "Sachin", state: "Gujarat" }
};

// Function to look up a PIN code and display details
function checkPincode() {
    const input = document.getElementById('pincodeInput1').value.trim(); // Corrected input field ID
    const messageDiv = document.getElementById('message1'); // Corrected message div ID
    const locationContainer = document.getElementById('locationContainer');
    const locationText = document.getElementById('locationText1'); // Corrected location text ID

    // Reset previous messages
    messageDiv.textContent = '';
    locationContainer.style.display = 'none';
    locationText.textContent = '';

    // Validate the PIN code (6-digit, first digit not 0)
    const pinPattern = /^[1-9][0-9]{5}$/;
    if (!pinPattern.test(input)) {
        messageDiv.textContent = 'Please enter a valid 6-digit PIN code.';
        messageDiv.classList.add('error');
        return;
    }

    // Look up the PIN code
    const details = gujaratPincodeData[input];
    if (details) {
        // Format the area info (join array values if necessary)
        let areaDisplay = Array.isArray(details.area) ? details.area.join(', ') : details.area;
        locationText.textContent = `City: ${details.city} | Area: ${areaDisplay} | State: ${details.state}`;
        messageDiv.textContent = 'Location found!';
        messageDiv.classList.add('success');
        locationContainer.style.display = 'flex';
    } else {
        messageDiv.textContent = 'PIN code not found in our dataset.';
        messageDiv.classList.add('error');
    }
}
