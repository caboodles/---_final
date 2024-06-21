document.addEventListener("DOMContentLoaded", () => {
    const reviewList = document.getElementById("reviewList");
    const sortReviews = document.getElementById("sortReviews");
    const filterProduct = document.getElementById("filterProduct");
    const filterButton = document.getElementById("filterButton");
    const clearFilter = document.getElementById("clearFilter");
    const starSummary = document.getElementById("starSummary");
    const newReviewButton = document.getElementById("newReviewButton");

    // 리뷰 작성 페이지로 이동
    newReviewButton.addEventListener("click", () => {
        window.location.href = "new-review.html";
    });

    // 미리 작성된 리뷰 데이터
    const prewrittenReviews = [
        {
            id: generateUniqueId(),
            title: "정말 맛있어요!",
            name: "박춘덕",
            product: "감귤",
            score: 5,
            content: "최고의 맛, 최고의 향, 최고의 품질입니다.",
            date: "2024-06-01",
            clicks: 0,
        },
        {
            id: generateUniqueId(),
            title: "괜찮아요",
            name: "김철수",
            product: "천혜향",
            score: 3,
            content: "괜찮은 맛이지만 더 나아질 수 있을 것 같아요.",
            date: "2024-06-02",
            clicks: 0,
        },
        {
            id: generateUniqueId(),
            title: "추천합니다",
            name: "곽민수",
            product: "천혜향",
            score: 4,
            content: "배송도 빠르고 맛도 좋아요. 추천합니다.",
            date: "2024-06-06",
            clicks: 0,
        },
        {
            id: generateUniqueId(),
            title: "가격만큼의 가치가 있어요",
            name: "이영희",
            product: "한라봉",
            score: 5,
            content: "합리적인 가격에 좋은 품질의 한라봉입니다.",
            date: "2024-06-03",
            clicks: 0,
        },
    ];

    // 세션 스토리지에서 리뷰 로드
    let reviews = loadReviewsFromSessionStorage();

    // 고유 ID 생성 함수
    function generateUniqueId() {
        return "_" + Math.random().toString(36).substr(2, 9);
    }

    // 세션 스토리지에서 리뷰 로드, 없으면 미리 작성된 리뷰 사용
    function loadReviewsFromSessionStorage() {
        const storedReviews = sessionStorage.getItem("reviews");
        if (!storedReviews) {
            saveReviewsToSessionStorage(prewrittenReviews);
            return prewrittenReviews;
        }
        return JSON.parse(storedReviews);
    }

    // 리뷰를 세션 스토리지에 저장
    function saveReviewsToSessionStorage(reviews) {
        sessionStorage.setItem("reviews", JSON.stringify(reviews));
    }

    // 로그인된 사용자 정보 가져오기
    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    // 사용자 관리자 여부 확인
    function isAdmin() {
        const user = getLoggedInUser();
        return user && user.isAdmin;
    }

    // 리뷰 필터 및 정렬 후 표시 함수
    const displayReviews = (filter = "", sortBy = "date") => {
        reviewList.innerHTML = "";
        let filteredReviews = reviews.filter((r) => r.product.includes(filter));
        filteredReviews = filteredReviews.sort((a, b) => {
            if (sortBy === "stars") return b.score - a.score;
            if (sortBy === "clicks") return b.clicks - a.clicks;
            if (sortBy === "date") return new Date(b.date) - new Date(a.date);
        });

        filteredReviews.forEach((review) => {
            const reviewCard = document.createElement("div");
            reviewCard.classList.add("review-card");
            reviewCard.innerHTML = `
                <h3>${review.title}</h3>
                <div class="basic_info">
                <div>Rating: ${"★".repeat(review.score)}</div>
                <div>By: ${review.name}</div>
                <div>Product: ${review.product || "N/A"}</div>
                <div>Date: ${review.date}</div>
                <div class="click-count">Clicks: ${review.clicks}</div>
                </div>
                <div class="details" style="display: none;"><p>${
                    review.content
                }</p></div>
                ${
                    isAdmin()
                        ? `<button class="delete-button" data-id="${review.id}">Delete</button>`
                        : ""
                }
            `;

            reviewCard.addEventListener("click", (event) => {
                if (!event.target.classList.contains("delete-button")) {
                    const details = reviewCard.querySelector(".details");
                    const clickCountElement =
                        reviewCard.querySelector(".click-count");
                    if (
                        details.style.display === "none" ||
                        details.style.display === ""
                    ) {
                        details.style.display = "block";
                        review.clicks++;
                    } else {
                        details.style.display = "none";
                    }
                    if (clickCountElement) {
                        clickCountElement.textContent = `Clicks: ${review.clicks}`;
                    } else {
                        console.log("clickCountElement not found");
                    }
                    saveReviewsToSessionStorage(reviews);
                }
            });

            if (isAdmin()) {
                reviewCard
                    .querySelector(".delete-button")
                    .addEventListener("click", (event) => {
                        event.stopPropagation();
                        const reviewId = event.target.dataset.id;
                        reviews = reviews.filter(
                            (review) => review.id !== reviewId
                        );
                        saveReviewsToSessionStorage(reviews);
                        updateProductDropdown();
                        displayReviews(filterProduct.value, sortReviews.value);
                        updateStarSummary();
                    });
            }

            reviewList.appendChild(reviewCard);
        });
    };

    filterButton.addEventListener("click", () => {
        const selectedProduct = filterProduct.value;
        displayReviews(selectedProduct, sortReviews.value);
    });

    clearFilter.addEventListener("click", () => {
        filterProduct.value = "";
        displayReviews();
    });

    sortReviews.addEventListener("change", () => {
        displayReviews(filterProduct.value, sortReviews.value);
    });

    const updateProductDropdown = () => {
        const uniqueProducts = [
            ...new Set(reviews.map((review) => review.product)),
        ];
        filterProduct.innerHTML = '<option value="">모든 상품</option>';
        uniqueProducts.forEach((product) => {
            const option = document.createElement("option");
            option.value = product;
            option.textContent = product;
            filterProduct.appendChild(option);
        });
    };

    const updateStarSummary = () => {
        starSummary.innerHTML = "";

        const starCounts = Array(5).fill(0);
        let totalReviews = 0;
        let totalRating = 0;

        reviews.forEach((review) => {
            starCounts[review.score - 1]++;
            totalReviews++;
            totalRating += review.score;
        });

        const averageRating = (totalRating / totalReviews).toFixed(1);

        starSummary.innerHTML = `
            <div class="review-summary">
                <div class="average-rating-container">
                    <div class="average-rating">${averageRating}</div>
                    <div class="average-rating-stars">
                        ${"★".repeat(Math.round(averageRating))}${"☆".repeat(
            5 - Math.round(averageRating)
        )}
                    </div>
                    <div class="review-count">${totalReviews} reviews</div>
                </div>
                <div class="summary-content">
                    ${[5, 4, 3, 2, 1]
                        .map(
                            (star) => `
                        <div class="rating-bar">
                            <span class="rating-label">${star}</span>
                            <div class="rating-bar-fill">
                                <div class="fill" style="width: ${
                                    (starCounts[star - 1] / totalReviews) * 100
                                }%"></div>
                            </div>
                            <span class="rating-count">${
                                starCounts[star - 1]
                            }</span>
                        </div>
                    `
                        )
                        .join("")}
                </div>
            </div>
        `;
    };

    // 페이지 로드 시 리뷰 표시 및 드롭다운 업데이트
    displayReviews();
    updateProductDropdown();
    updateStarSummary();
});
