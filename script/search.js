// Sample dataset
const data = [
    "Elegant Korean Necklace",
    "Traditional Korean Earrings",
    "Korean Bracelet Set",
    "Minimalist Korean Rings",
    "Korean Jewelry Box",
    "Pearl Korean Earrings",
    "Gold-Plated Korean Necklace",
    "Custom Korean Jewelry",
    "Handmade Korean Accessories"
];

// Function to gather and display search results
    function gatherData() {
    const input = document.getElementById("navSearchInp").value.toLowerCase();
    const resultsContainer = document.getElementById("searchResults");
    resultsContainer.innerHTML = ""; // Clear previous results

    if (input.trim() === "") {
        resultsContainer.innerHTML = "<p>Type something to search...</p>";
        return;
    }

    const filteredData = data.filter(item => item.toLowerCase().includes(input));

    if (filteredData.length === 0) {
        resultsContainer.innerHTML = "<p>No results found.</p>";
    } else {
        filteredData.forEach(item => {
            const resultItem = document.createElement("div");
            resultItem.className = "search-item";
            resultItem.textContent = item;
            resultsContainer.appendChild(resultItem);
        });
    }
}
