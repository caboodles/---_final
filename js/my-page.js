document.addEventListener("DOMContentLoaded", () => {
    const userInfoDiv = document.getElementById("userInfo");
    const purchaseHistoryDiv = document.getElementById("purchaseHistory");
    const editUserInfoButton = document.getElementById("editUserInfoButton");
    const userInfoModal = document.getElementById("userInfoModal");
    const userInfoForm = document.getElementById("userInfoForm");
    const closeModal = document.getElementsByClassName("close")[0];

    const user = getLoggedInUser();
    if (!user) {
        alert("로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다...");
        window.location.href = "login.html";
        return;
    }

    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    function saveUserToSessionStorage(user) {
        const users = JSON.parse(sessionStorage.getItem("users"));
        const userIndex = users.findIndex((u) => u.userId === user.userId);
        if (userIndex !== -1) {
            users[userIndex] = user;
            sessionStorage.setItem("users", JSON.stringify(users));
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        }
    }

    function renderUserInfo() {
        userInfoDiv.innerHTML = `
            <p><strong>User ID:</strong> ${user.userId}</p>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Address:</strong> ${user.address}</p>
            <p><strong>Phone:</strong> ${user.phone}</p>
            <p><strong>Birthdate:</strong> ${user.birthdate}</p>
        `;
    }

    function renderPurchaseHistory() {
        purchaseHistoryDiv.innerHTML = "";
        const products = JSON.parse(sessionStorage.getItem("products")) || [];
        const purchasedItems = user.purchased || {};

        Object.keys(purchasedItems).forEach((productId) => {
            const product = products.find(
                (prod) => prod.id === parseInt(productId)
            );
            if (product) {
                const purchaseCard = document.createElement("div");
                purchaseCard.className = "card";
                purchaseCard.innerHTML = `
                    <span>${product.name} - 수량: ${purchasedItems[productId]}</span>
                    <button class="refund-button" data-id="${productId}">반품</button>
                `;
                purchaseCard
                    .querySelector(".refund-button")
                    .addEventListener("click", () => {
                        delete user.purchased[productId];
                        saveUserToSessionStorage(user);
                        renderPurchaseHistory();
                    });
                purchaseHistoryDiv.appendChild(purchaseCard);
            }
        });
    }

    editUserInfoButton.addEventListener("click", () => {
        document.getElementById("userName").value = user.name;
        document.getElementById("userAddress").value = user.address;
        document.getElementById("userPhone").value = user.phone;
        document.getElementById("userBirthdate").value = user.birthdate;
        userInfoModal.style.display = "flex";
    });

    userInfoForm.addEventListener("submit", (event) => {
        event.preventDefault();
        user.name = document.getElementById("userName").value;
        user.address = document.getElementById("userAddress").value;
        user.phone = document.getElementById("userPhone").value;
        user.birthdate = document.getElementById("userBirthdate").value;
        saveUserToSessionStorage(user);
        userInfoModal.style.display = "none";
        renderUserInfo();
    });

    closeModal.addEventListener("click", () => {
        userInfoModal.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target == userInfoModal) {
            userInfoModal.style.display = "none";
        }
    });

    renderUserInfo();
    renderPurchaseHistory();
});
