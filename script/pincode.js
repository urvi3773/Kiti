const indiaPincodeData = {
    // --- Surat (Gujarat) ---
    "395001": { city: "Surat", area: "Athwalines / Nanpura", state: "Gujarat" },
    "395002": { city: "Surat", area: "Majura Gate / Ring Road", state: "Gujarat" },
    "395003": { city: "Surat", area: "Athwa", state: "Gujarat" },
    "395004": { city: "Surat", area: "Katargam", state: "Gujarat" },
    "395005": { city: "Surat", area: "Rander", state: "Gujarat" },
    "395006": { city: "Surat", area: "Varachha Road", state: "Gujarat" },
    "395007": { city: "Surat", area: "City Light / Piplod / Bhatar / Vesu", state: "Gujarat" },
    "395008": { city: "Surat", area: "Parvat Patiya", state: "Gujarat" },
    "395009": { city: "Surat", area: "Adajan Dn / Palanpur Patia", state: "Gujarat" },
    "395010": { city: "Surat", area: "Parvat Patiya / Vesu", state: "Gujarat" },
    "395011": { city: "Surat", area: "Piplod", state: "Gujarat" },
    "395012": { city: "Surat", area: "Dumas", state: "Gujarat" },
    "395013": { city: "Surat", area: "Magdalla", state: "Gujarat" },
    "395014": { city: "Surat", area: "Bhatar", state: "Gujarat" },
    "395015": { city: "Surat", area: "City Light", state: "Gujarat" },
    "395017": { city: "Surat", area: "Pal", state: "Gujarat" },
    "394101": { city: "Surat", area: "Sachin", state: "Gujarat" },
    "394107": { city: "Surat", area: "Amroli", state: "Gujarat" },
    "394210": { city: "Surat", area: "Udhna Industrial Estate", state: "Gujarat" },
    "394221": { city: "Surat", area: "Pandesar", state: "Gujarat" },

    // --- Other Gujarat Cities ---
    // Valsad
    "396001": { city: "Valsad", area: "Valsad", state: "Gujarat" },
    // Navsari – note: different sources list various “primary” codes; 396110 is common in some records
    "396110": { city: "Navsari", area: "Navsari", state: "Gujarat" },
    // Ankleshwar
    "393001": { city: "Ankleshwar", area: "Ankleshwar", state: "Gujarat" },
    // Khambhat (Cambay)
    "392107": { city: "Khambhat", area: "Khambhat", state: "Gujarat" },
    // Dharampur (in Valsad district)
    "396190": { city: "Dharampur", area: "Dharampur", state: "Gujarat" },
    // Ahmedabad
    "380001": { city: "Ahmedabad", area: "City Centre", state: "Gujarat" },
    "380002": { city: "Ahmedabad", area: "Raipur", state: "Gujarat" },
    "380003": { city: "Ahmedabad", area: "Dariapur", state: "Gujarat" },
    "380004": { city: "Ahmedabad", area: "Astodia", state: "Gujarat" },
    "380005": { city: "Ahmedabad", area: "Gita Mandir", state: "Gujarat" },
    "380006": { city: "Ahmedabad", area: "Ellis Bridge", state: "Gujarat" },
    "380007": { city: "Ahmedabad", area: "Maninagar", state: "Gujarat" },
    "380008": { city: "Ahmedabad", area: "Kankaria", state: "Gujarat" },
    "380009": { city: "Ahmedabad", area: "Navrangpura", state: "Gujarat" },
    "380010": { city: "Ahmedabad", area: "Paldi", state: "Gujarat" },
    "380015": { city: "Ahmedabad", area: "Vastrapur", state: "Gujarat" },
    "382010": { city: "Ahmedabad", area: "Naroda", state: "Gujarat" },
    // Gandhinagar
    "382405": { city: "Gandhinagar", area: "Sector 11", state: "Gujarat" },
    "382421": { city: "Gandhinagar", area: "Kudasan", state: "Gujarat" },
    // Patan
    "384001": { city: "Patan", area: "Patan", state: "Gujarat" },
    // Mehsana
    "384107": { city: "Mehsana", area: "Mehsana", state: "Gujarat" },
    // Palanpur
    "385001": { city: "Palanpur", area: "Palanpur", state: "Gujarat" },
    // Rajkot
    "360001": { city: "Rajkot", area: "Rajkot", state: "Gujarat" },
    // Jamnagar
    "361001": { city: "Jamnagar", area: "Jamnagar", state: "Gujarat" },
    // Junagadh
    "362001": { city: "Junagadh", area: "Junagadh", state: "Gujarat" },
    // Bhavnagar
    "364001": { city: "Bhavnagar", area: "Bhavnagar", state: "Gujarat" },
    // Bhuj
    "370001": { city: "Bhuj", area: "Bhuj", state: "Gujarat" },
    // Sanand
    "382721": { city: "Sanand", area: "Sanand", state: "Gujarat" },
    // Bharuch
    "392001": { city: "Bharuch", area: "Bharuch", state: "Gujarat" },

    // --- Outlying areas ---
    // Daman (Union Territory: Daman and Diu)
    "396210": { city: "Daman", area: "Daman", state: "Daman and Diu" },
    // Dadra (Union Territory: Dadra and Nagar Haveli)
    "396240": { city: "Dadra", area: "Dadra", state: "Dadra and Nagar Haveli" }
};


function checkPincode() {
    const input = document.getElementById('pincodeInput1').value.trim();
    const messageDiv = document.getElementById('message1');
    const locationContainer = document.getElementById('locationContainer');
    const locationText = document.getElementById('locationText1');

    messageDiv.textContent = "";
    messageDiv.className = "dropdown-message";
    locationContainer.style.display = "none";
    locationText.textContent = "";

    if (!/^[0-9]{6}$/.test(input)) {
        messageDiv.textContent = "Not a valid PIN code. Please enter a 6-digit PIN code.";
        messageDiv.className = "dropdown-message error";
        return;
    }

    const location = indiaPincodeData[input];
    if (location) {
        messageDiv.textContent = "Location found!";
        messageDiv.className = "dropdown-message success";
        locationContainer.style.display = "flex";
        locationText.textContent = `${location.area}, ${location.city}, ${location.state}`;
    } else {
        messageDiv.textContent = "Invalid PIN code. Please check the PIN code and try again.";
        messageDiv.className = "dropdown-message error";
    }
}

document.getElementById('pincodetButton').addEventListener('click', function () {
    const pincodeSection = document.getElementById('pincodeSection');
    pincodeSection.style.display = pincodeSection.style.display === "none" || pincodeSection.style.display === "" ? "block" : "none";
});

document.getElementById('pincodeInput1').addEventListener('input', function () {
    const messageDiv = document.getElementById('message1');
    const locationContainer = document.getElementById('locationContainer');
    const locationText = document.getElementById('locationText1');

    messageDiv.textContent = "";
    messageDiv.className = "dropdown-message";
    locationContainer.style.display = "none";
    locationText.textContent = "";
});