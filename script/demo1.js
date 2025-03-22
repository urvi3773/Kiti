function addToWishlist(productName, productPrice, productImage) {
    const product = {
        name: productName,
        price: productPrice,
        image: productImage
    };

    // Get existing wishlist from localStorage or an empty array if not found
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

    // Add the new product to the wishlist
    wishlist.push(product);

    // Save the updated wishlist back to localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));

    // Redirect to the wishlist page
    window.location.href = "/src/wishlist.html";  // Make sure the path is correct
}