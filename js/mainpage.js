document.addEventListener("DOMContentLoaded", () => {
    // 주문 버튼에 이벤트 리스너 추가
    const orderButton = document.querySelector(".button");
    orderButton.addEventListener("click", () => {
        window.location.href = "products.html"; // 주문 페이지로 이동
    });

    const reviewsSection = document.getElementById("reviews-section");

    // 세션 스토리지에서 리뷰 로드
    const reviews = loadReviewsFromSessionStorage();

    // 별점 4점 또는 5점인 리뷰 필터링
    const fiveStarReviews = reviews.filter(
        (review) => review.score === 4 || review.score === 5
    );

    // 별점 4점 또는 5점인 리뷰가 있을 경우 리뷰 표시
    if (fiveStarReviews.length > 0) {
        displayFiveStarReviews(fiveStarReviews);
    } else {
        reviewsSection.innerHTML =
            "<p>별점 4점 또는 5점인 리뷰가 아직 없습니다.</p>";
    }

    // 세션 스토리지에서 리뷰를 로드하는 함수
    function loadReviewsFromSessionStorage() {
        const storedReviews = sessionStorage.getItem("reviews");
        return storedReviews ? JSON.parse(storedReviews) : [];
    }

    // 별점 4점 또는 5점인 리뷰를 표시하는 함수
    function displayFiveStarReviews(reviews) {
        let currentIndex = 0;

        // 현재 리뷰를 표시하는 함수
        const showReview = () => {
            const review = reviews[currentIndex];
            reviewsSection.innerHTML = `
                <h3>${review.title}</h3>
                <p>별점: ${"★".repeat(review.score)}${"☆".repeat(
                5 - review.score
            )}</p>
                <p>작성자: ${review.name}</p>
            `;
            currentIndex = (currentIndex + 1) % reviews.length;
        };

        // 첫 번째 리뷰를 표시
        showReview();

        // 3초마다 리뷰를 순환하며 표시
        setInterval(showReview, 3000);
    }
});
