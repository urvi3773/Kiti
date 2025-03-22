

document.addEventListener("DOMContentLoaded", function () {
  const filterBar = document.querySelector(".filter-sort-bar");
  const resetButton = document.querySelector(".reset-btn");
  const jewelryItems = document.querySelectorAll(".Jewellery-item");
  const noResults = document.querySelector(".no-results");

  let activeFilters = {
    price: null,
    shopFor: null,
    category: null,
    subcategory: null,
  };

  // Function to parse price range
  function parsePriceRange(range) {
    const [min, max] = range.split(" - ").map((price) => parseInt(price.replace(/,/g, ""), 10));
    return { min, max };
  }

  // Function to apply filters
  function applyFilters() {
    let visibleCount = 0;

    jewelryItems.forEach((item) => {
      const itemPrice = parseInt(item.dataset.price.replace(/,/g, ""), 10);
      const itemShopFor = item.dataset.shopFor;
      const itemCategory = item.dataset.category;
      const itemSubcategory = item.dataset.subcategory;

      const matchesPrice =
        !activeFilters.price ||
        (itemPrice >= parsePriceRange(activeFilters.price).min &&
          itemPrice <= parsePriceRange(activeFilters.price).max);
      const matchesShopFor = !activeFilters.shopFor || itemShopFor === activeFilters.shopFor;
      const matchesCategory = !activeFilters.category || itemCategory === activeFilters.category;
      const matchesSubcategory = !activeFilters.subcategory || itemSubcategory === activeFilters.subcategory;

      if (matchesPrice && matchesShopFor && matchesCategory && matchesSubcategory) {
        item.style.display = "block";
        visibleCount++;
      } else {
        item.style.display = "none";
      }
    });

    noResults.classList.toggle("hidden", visibleCount > 0);
  }

  // Event listener for filter clicks
  filterBar.addEventListener("click", function (e) {
    const target = e.target;
    if (target.tagName === "A" && target.dataset.filter) {
      e.preventDefault();
      const filterType = target.dataset.filter;
      const filterValue = target.dataset.value;

      activeFilters[filterType] = filterValue;
      applyFilters();
    }
  });

  // Reset filters
  resetButton.addEventListener("click", function () {
    activeFilters = {
      price: null,
      shopFor: null,
      category: null,
      subcategory: null,
    };
    applyFilters();
  });

  // Initial filter application
  applyFilters();
});


