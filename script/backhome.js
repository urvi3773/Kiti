
document.addEventListener('DOMContentLoaded', function () {
    // Get the back-to-top button
    let backToTopButton = document.getElementById("backToTop");

    // Show or hide the "Back to Top" button based on scroll position
    window.onscroll = function () {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopButton.classList.add("show"); // Add show class when scrolled
        } else {
            backToTopButton.classList.remove("show"); // Remove show class when not scrolled
        }
    };

    // Scroll to the top when the button is clicked
    backToTopButton.onclick = function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
});


