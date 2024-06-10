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

            cartCard.querySelector("button").addEventListener("click", () => {
                delete user.cart[product.id];
                saveUserToSessionStorage(user);
                renderCart();
                updateCartSummary();
            });

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
                <span style= "padding-left:10px">전체 가격 : ₩${totalPrice.toLocaleString()}</span>
            </div>
        `;
    }

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
                <span style= "padding-left:10px">선택한 상품 가격 : ₩${selectedPrice.toLocaleString()}</span>
            </div>
        `;

        cartSummary.appendChild(selectedSummary);
    }

    selectAllButton.addEventListener("click", () => {
        const cartProducts = getCartProducts();
        if (selectedItems.size === cartProducts.length) {
            // Unselect all items
            selectedItems.clear();
            cartProducts.forEach((product) => {
                const cartCard = document.querySelector(
                    `.cart-card[data-product-id="${product.id}"]`
                );
                cartCard.classList.remove("selected");
            });
        } else {
            // Select all items
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

    function saveUserToSessionStorage(user) {
        const users = JSON.parse(sessionStorage.getItem("users"));
        const userIndex = users.findIndex((u) => u.userId === user.userId);
        if (userIndex !== -1) {
            users[userIndex] = user;
            sessionStorage.setItem("users", JSON.stringify(users));
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        }
    }

    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    renderCart();
});
