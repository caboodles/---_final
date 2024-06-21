document.addEventListener("DOMContentLoaded", () => {
    const reviewForm = document.getElementById("reviewForm");
    const backToReviewsButton = document.getElementById("backToReviewsButton");
    const productNameDropdown = document.getElementById("productName");

    // 상품 드롭다운 메뉴 채우기
    function populateProductDropdown() {
        const products = loadProductsFromSessionStorage();
        products.forEach((product) => {
            const option = document.createElement("option");
            option.value = product.name;
            option.textContent = product.name;
            productNameDropdown.appendChild(option);
        });
    }

    // 세션 스토리지에서 상품 불러오기
    function loadProductsFromSessionStorage() {
        const storedProducts = sessionStorage.getItem("products");
        return storedProducts ? JSON.parse(storedProducts) : [];
    }

    // 고유 ID 생성
    function generateUniqueId() {
        return "_" + Math.random().toString(36).substr(2, 9);
    }

    // 세션 스토리지에서 리뷰 불러오기
    function loadReviewsFromSessionStorage() {
        const storedReviews = sessionStorage.getItem("reviews");
        return storedReviews ? JSON.parse(storedReviews) : [];
    }

    // 세션 스토리지에 리뷰 저장
    function saveReviewsToSessionStorage(reviews) {
        sessionStorage.setItem("reviews", JSON.stringify(reviews));
    }

    // '돌아가기' 버튼 클릭 이벤트
    backToReviewsButton.addEventListener("click", () => {
        window.location.href = "reviews.html";
    });

    // 리뷰 폼 제출 이벤트
    reviewForm.addEventListener("submit", (event) => {
        event.preventDefault();

        // 새로운 리뷰 생성
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

        // 기존 리뷰에 새 리뷰 추가
        let reviews = loadReviewsFromSessionStorage();
        reviews.push(newReview);
        saveReviewsToSessionStorage(reviews);

        reviewForm.reset(); // 폼 초기화
        window.location.href = "reviews.html"; // 리뷰 페이지로 이동
    });

    populateProductDropdown(); // 상품 드롭다운 초기화
});
