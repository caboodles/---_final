document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cartItems");
    const cartSummary = document.getElementById("cartSummary");
    const selectAllButton = document.getElementById("selectAllButton");
    const buyNowButton = document.getElementById("buyNowButton");

    const user = getLoggedInUser();
    if (!user) {
        alert(
            "장바구니를 확인하려면 로그인해야 합니다. 로그인 페이지로 이동합니다..."
        );
        window.location.href = "login.html";
        return;
    }

    const products = JSON.parse(sessionStorage.getItem("products")) || [];
    let selectedItems = new Set();

    // 장바구니에 담긴 상품 정보 가져오기
    function getCartProducts() {
        return Object.keys(user.cart).map((productId) => {
            const product = products.find(
                (product) => product.id === parseInt(productId)
            );
            return {
                ...product,
                quantity: user.cart[productId],
            };
        });
    }

    // 장바구니 UI 렌더링
    function renderCart() {
        cartItemsContainer.innerHTML = "";
        const cartProducts = getCartProducts();

        cartProducts.forEach((product) => {
            const cartCard = document.createElement("div");
            cartCard.className = "cart-card";
            cartCard.dataset.productId = product.id;

            cartCard.innerHTML = `
                <h3>${product.name}</h3>
                <input type="number" value="${product.quantity}" min="1" />
                <button class="delete-button" data-id="${product.id}">X</button>
            `;

            // 수량 변경 이벤트 처리
            cartCard
                .querySelector("input")
                .addEventListener("input", (event) => {
                    const quantity = parseInt(event.target.value);
                    if (quantity > 0) {
                        user.cart[product.id] = quantity;
                        saveUserToSessionStorage(user);
                        updateCartSummary();
                    }
                });

            // 삭제 버튼 클릭 이벤트 처리
            cartCard.querySelector("button").addEventListener("click", () => {
                delete user.cart[product.id];
                saveUserToSessionStorage(user);
                renderCart();
                updateCartSummary();
            });

            // 아이템 선택/해제 이벤트 처리
            cartCard.addEventListener("click", (event) => {
                if (event.target.tagName !== "BUTTON") {
                    if (selectedItems.has(product.id)) {
                        selectedItems.delete(product.id);
                        cartCard.classList.remove("selected");
                    } else {
                        selectedItems.add(product.id);
                        cartCard.classList.add("selected");
                    }
                    updateSelectedSummary();
                }
            });

            cartItemsContainer.appendChild(cartCard);
        });

        updateCartSummary();
        updateSelectedSummary();
    }

    // 장바구니 요약 정보 업데이트
    function updateCartSummary() {
        const totalItems = Object.keys(user.cart).length;
        const totalPrice = Object.keys(user.cart).reduce((total, productId) => {
            const product = products.find(
                (product) => product.id === parseInt(productId)
            );
            return total + product.price * user.cart[productId];
        }, 0);

        cartSummary.innerHTML = `
            <div id="totalSummary">
                <span>전체 상품 : ${totalItems}</span>
                <span style="padding-left:10px">전체 가격 : ₩${totalPrice.toLocaleString()}</span>
            </div>
        `;
    }

    // 선택된 상품 요약 정보 업데이트
    function updateSelectedSummary() {
        const selectedSummaryDiv = document.getElementById("selectedSummary");
        if (selectedSummaryDiv) {
            selectedSummaryDiv.remove();
        }

        const selectedProducts = Array.from(selectedItems).map((id) => {
            return products.find((product) => product.id === parseInt(id));
        });

        const selectedCount = selectedProducts.length;
        const selectedPrice = selectedProducts.reduce((total, product) => {
            return total + product.price * user.cart[product.id];
        }, 0);

        const selectedSummary = document.createElement("div");
        selectedSummary.id = "selectedSummary";
        selectedSummary.innerHTML = `
            <div id="selectedSummary">
                <span>선택한 상품 : ${selectedCount}</span>
                <span style="padding-left:10px">선택한 상품 가격 : ₩${selectedPrice.toLocaleString()}</span>
            </div>
        `;

        cartSummary.appendChild(selectedSummary);
    }

    // 모두 선택/해제 버튼 이벤트 처리
    selectAllButton.addEventListener("click", () => {
        const cartProducts = getCartProducts();
        if (selectedItems.size === cartProducts.length) {
            // 모든 아이템 선택 해제
            selectedItems.clear();
            cartProducts.forEach((product) => {
                const cartCard = document.querySelector(
                    `.cart-card[data-product-id="${product.id}"]`
                );
                cartCard.classList.remove("selected");
            });
        } else {
            // 모든 아이템 선택
            selectedItems.clear();
            cartProducts.forEach((product) => {
                selectedItems.add(product.id);
                const cartCard = document.querySelector(
                    `.cart-card[data-product-id="${product.id}"]`
                );
                cartCard.classList.add("selected");
            });
        }
        updateSelectedSummary();
    });

    // 구매 버튼 이벤트 처리
    buyNowButton.addEventListener("click", () => {
        if (selectedItems.size === 0) {
            alert("구매할 상품을 선택해주세요.");
            return;
        }

        selectedItems.forEach((productId) => {
            const quantity = user.cart[productId];
            if (!user.purchased[productId]) {
                user.purchased[productId] = 0;
            }
            user.purchased[productId] += quantity;
            delete user.cart[productId];
        });

        saveUserToSessionStorage(user);
        selectedItems.clear();
        renderCart();
        alert("선택한 상품이 구매되었습니다.");
    });

    // 사용자 정보 세션 스토리지에 저장
    function saveUserToSessionStorage(user) {
        const users = JSON.parse(sessionStorage.getItem("users"));
        const userIndex = users.findIndex((u) => u.userId === user.userId);
        if (userIndex !== -1) {
            users[userIndex] = user;
            sessionStorage.setItem("users", JSON.stringify(users));
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        }
    }

    // 로그인된 사용자 정보 로드
    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    renderCart(); // 장바구니 초기 렌더링
});
