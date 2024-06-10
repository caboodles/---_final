document.addEventListener("DOMContentLoaded", () => {
    // Add event listener to the order button
    const orderButton = document.querySelector(".button");
    orderButton.addEventListener("click", () => {
        window.location.href = "products.html";
    });

    const reviewsSection = document.getElementById("reviews-section");

    // Load reviews from session storage
    const reviews = loadReviewsFromSessionStorage();

    // Filter for five-star reviews
    const fiveStarReviews = reviews.filter(
        (review) => review.score === 4 || review.score === 5
    );

    // Start displaying reviews if there are any five-star reviews
    if (fiveStarReviews.length > 0) {
        displayFiveStarReviews(fiveStarReviews);
    } else {
        reviewsSection.innerHTML = "<p>No four or five-star reviews yet.</p>";
    }

    function loadReviewsFromSessionStorage() {
        const storedReviews = sessionStorage.getItem("reviews");
        return storedReviews ? JSON.parse(storedReviews) : [];
    }

    function displayFiveStarReviews(reviews) {
        let currentIndex = 0;

        // Function to display the current review details
        const showReview = () => {
            const review = reviews[currentIndex];
            reviewsSection.innerHTML = `
                <h3>${review.title}</h3>
                <p>Rating: ${"★".repeat(review.score)}${"☆".repeat(
                5 - review.score
            )}</p>
                <p>By: ${review.name}</p>
            `;
            currentIndex = (currentIndex + 1) % reviews.length;
        };

        // Display the first review
        showReview();

        // Cycle through reviews every 3 seconds
        setInterval(showReview, 3000);
    }
});
