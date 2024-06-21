// 사전 로드된 상품 목록 정의
const preloadedProducts = [
    {
        id: 1,
        name: "천혜향",
        description: "향이 좋아요!",
        price: 13000,
        imageUrl: "../images/gamgyul1.jpg",
    },
    {
        id: 2,
        name: "한라봉",
        description: "맛이 좋아요!",
        price: 15000,
        imageUrl: "../images/gamgyul2.jpg",
    },
    {
        id: 3,
        name: "감귤",
        description: "신선하고 맛있어요!",
        price: 12000,
        imageUrl: "../images/gamgyul3.jpg",
    },
];

// 세션 스토리지에서 상품 로드, 없으면 사전 로드된 상품 사용
function loadProducts() {
    const storedProducts = sessionStorage.getItem("products");
    if (!storedProducts) {
        sessionStorage.setItem("products", JSON.stringify(preloadedProducts));
        return preloadedProducts;
    }
    return JSON.parse(storedProducts);
}

// 세션 스토리지에 상품 저장
function saveProducts() {
    sessionStorage.setItem("products", JSON.stringify(products));
}

// 초기 상품 배열
let products = loadProducts();

// 로그인된 사용자 가져오기
function getLoggedInUser() {
    const user = sessionStorage.getItem("loggedInUser");
    return user ? JSON.parse(user) : null;
}

// 사용자가 관리자 여부 확인
function isAdmin() {
    const user = getLoggedInUser();
    return user && user.isAdmin;
}

// 새로운 상품 추가
function addProduct() {
    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const price = document.getElementById("productPrice").value;
    const imageUrl = document.getElementById("productImage").value;

    const product = {
        id: Date.now(), // 고유 ID 생성
        name: name,
        description: description,
        price: price,
        imageUrl: imageUrl,
    };

    products.push(product); // 배열에 새 상품 추가
    saveProducts(); // 세션 스토리지에 저장
    renderProducts(); // 상품 다시 렌더링
}

// 상품 삭제
function deleteProduct(productId) {
    products = products.filter((product) => product.id !== productId);
    saveProducts(); // 세션 스토리지에 저장
    renderProducts(); // 상품 다시 렌더링
}

// 카트에 상품 추가
function addToCart(productId) {
    const user = getLoggedInUser();
    if (!user) {
        // 로그인되지 않은 경우 로그인 페이지로 이동
        alert(
            "카트에 상품을 추가하려면 로그인이 필요합니다.\n로그인 페이지로 이동 중..."
        );
        window.location.href = "login.html";
        return;
    }

    const product = products.find((product) => product.id === productId);
    if (!product) {
        alert("상품을 찾을 수 없습니다.");
        return; // 상품을 찾을 수 없는 경우 종료
    }

    // 카트에 이미 상품이 있는지 확인
    if (user.cart[productId]) {
        user.cart[productId] += 1; // 수량 증가
        alert(
            `${product.name}의 수량이 증가되었습니다. 수량 : ${user.cart[productId]}`
        );
    } else {
        user.cart[productId] = 1; // 수량 1로 추가
        alert(`${product.name}이 카트에 추가되었습니다. 수량 : 1`);
    }

    // 세션 스토리지에 사용자 정보 업데이트
    const users = JSON.parse(sessionStorage.getItem("users"));
    const userIndex = users.findIndex((u) => u.userId === user.userId);
    if (userIndex !== -1) {
        users[userIndex] = user;
        sessionStorage.setItem("users", JSON.stringify(users));
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    }
}

// DOM에 상품 렌더링
function renderProducts() {
    const productGrid = document.getElementById("product-grid");
    productGrid.innerHTML = "";

    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.className = "card";
        productCard.innerHTML = `
            <img src="${product.imageUrl}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <p class="price">₩${product.price.toLocaleString()}</p>
            <button class="add-to-cart" onclick="addToCart(${
                product.id
            })">카트에 담기</button>
            ${
                isAdmin()
                    ? `<button class="delete-button" onclick="deleteProduct(${product.id})">X</button>` // 관리자만 삭제 버튼 표시
                    : ""
            }
        `;

        productGrid.appendChild(productCard); // 상품 카드 DOM에 추가
    });
}

// 페이지 로드 시 상품 로드 및 렌더링
window.onload = function () {
    products = loadProducts();
    if (isAdmin()) {
        document.getElementById("addProductForm").style.display = "block"; // 관리자면 상품 추가 폼 표시
    } else {
        document.getElementById("addProductForm").style.display = "none"; // 비관리자는 상품 추가 폼 숨김
    }
    renderProducts(); // 상품 렌더링
};
