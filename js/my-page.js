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

    // 로그인된 사용자 정보 가져오기
    function getLoggedInUser() {
        const user = sessionStorage.getItem("loggedInUser");
        return user ? JSON.parse(user) : null;
    }

    // 사용자 정보를 세션 스토리지에 저장
    function saveUserToSessionStorage(user) {
        const users = JSON.parse(sessionStorage.getItem("users"));
        const userIndex = users.findIndex((u) => u.userId === user.userId);
        if (userIndex !== -1) {
            users[userIndex] = user;
            sessionStorage.setItem("users", JSON.stringify(users));
            sessionStorage.setItem("loggedInUser", JSON.stringify(user));
        }
    }

    // 사용자 정보 렌더링
    function renderUserInfo() {
        userInfoDiv.innerHTML = `
            <p><strong>유저 ID : </strong> ${user.userId}</p>
            <p><strong>이름 : </strong> ${user.name}</p>
            <p><strong>주소 : </strong> ${user.address}</p>
            <p><strong>전화번호 : </strong>${user.phone}</p>
            <p><strong>생년월일 : </strong> ${user.birthdate}</p>
        `;
    }

    // 구매 내역 렌더링
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

    // 회원정보 수정 버튼 클릭 이벤트
    editUserInfoButton.addEventListener("click", () => {
        document.getElementById("userName").value = user.name;
        document.getElementById("userAddress").value = user.address;
        document.getElementById("userPhone").value = user.phone;
        document.getElementById("userBirthdate").value = user.birthdate;
        userInfoModal.style.display = "flex";
    });

    // 회원 정보 수정 폼 제출 이벤트
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

    // 모달 닫기 버튼 클릭 이벤트
    closeModal.addEventListener("click", () => {
        userInfoModal.style.display = "none";
    });

    // 모달 외부 클릭 시 모달 닫기
    window.addEventListener("click", (event) => {
        if (event.target == userInfoModal) {
            userInfoModal.style.display = "none";
        }
    });

    renderUserInfo(); // 회원 정보 초기 렌더링
    renderPurchaseHistory(); // 구매 내역 초기 렌더링
});
