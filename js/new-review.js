document.addEventListener("DOMContentLoaded", () => {
    const reviewForm = document.getElementById("reviewForm");
    const backToReviewsButton = document.getElementById("backToReviewsButton");
    const productNameDropdown = document.getElementById("productName");

    // Populate the product dropdown
    function populateProductDropdown() {
        const products = loadProductsFromSessionStorage();
        products.forEach((product) => {
            const option = document.createElement("option");
            option.value = product.name;
            option.textContent = product.name;
            productNameDropdown.appendChild(option);
        });
    }

    function loadProductsFromSessionStorage() {
        const storedProducts = sessionStorage.getItem("products");
        return storedProducts ? JSON.parse(storedProducts) : [];
    }

    function generateUniqueId() {
        return "_" + Math.random().toString(36).substr(2, 9);
    }

    function loadReviewsFromSessionStorage() {
        const storedReviews = sessionStorage.getItem("reviews");
        return storedReviews ? JSON.parse(storedReviews) : [];
    }

    function saveReviewsToSessionStorage(reviews) {
        sessionStorage.setItem("reviews", JSON.stringify(reviews));
    }

    backToReviewsButton.addEventListener("click", () => {
        window.location.href = "reviews.html";
    });

    reviewForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // Generate a unique ID for the new review
        const newReview = {
            id: generateUniqueId(),
            title: document.getElementById("reviewTitle").value,
            name: document.getElementById("reviewerName").value,
            product: productNameDropdown.value,
            score: parseInt(document.getElementById("reviewScore").value),
            content: document.getElementById("reviewContent").value,
            date: new Date().toISOString().split("T")[0],
            clicks: 0,
        };

        let reviews = loadReviewsFromSessionStorage();
        reviews.push(newReview);
        saveReviewsToSessionStorage(reviews);

        reviewForm.reset();
        window.location.href = "reviews.html";
    });

    populateProductDropdown();
});
