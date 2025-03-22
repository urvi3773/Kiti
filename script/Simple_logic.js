const searchInput = document.querySelector('.search-input');
const searchPlaceholder = document.querySelector('.search-placeholder');

// Hide the placeholder when user types, and show it if input is empty
searchInput.addEventListener('input', function () {
    if (this.value.trim() !== '') {
        searchPlaceholder.style.display = 'none';
    } else {
        searchPlaceholder.style.display = 'inline';
    }
});

// Optionally, hide placeholder on focus and show on blur if empty
searchInput.addEventListener('focus', function () {
    searchPlaceholder.style.display = 'none';
});
searchInput.addEventListener('blur', function () {
    if (this.value.trim() === '') {
        searchPlaceholder.style.display = 'inline';
    }
});


