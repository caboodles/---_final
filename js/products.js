// Define some preloaded products
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

// Load products from session storage or use default preloaded products
function loadProducts() {
    const storedProducts = sessionStorage.getItem("products");
    if (!storedProducts) {
        sessionStorage.setItem("products", JSON.stringify(preloadedProducts));
        return preloadedProducts;
    }
    return JSON.parse(storedProducts);
}

// Save products to session storage
function saveProducts() {
    sessionStorage.setItem("products", JSON.stringify(products));
}

// Initialize products array
let products = loadProducts();

// Get logged-in user
function getLoggedInUser() {
    const user = sessionStorage.getItem("loggedInUser");
    return user ? JSON.parse(user) : null;
}

// Check if user is admin
function isAdmin() {
    const user = getLoggedInUser();
    return user && user.isAdmin;
}

// Add a new product
function addProduct() {
    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const price = document.getElementById("productPrice").value;
    const imageUrl = document.getElementById("productImage").value;

    const product = {
        id: Date.now(),
        name: name,
        description: description,
        price: price,
        imageUrl: imageUrl,
    };

    products.push(product);
    saveProducts(); // Save the updated products array to session storage
    renderProducts();
}

// Delete a product
function deleteProduct(productId) {
    products = products.filter((product) => product.id !== productId);
    saveProducts(); // Save the updated products array to session storage
    renderProducts();
}

// Add item to cart
function addToCart(productId) {
    const user = getLoggedInUser();
    if (!user) {
        // Redirect to login page if not logged in
        alert(
            "카트에 상품을 추가하려면 로그인이 필요합니다.\n로그인 페이지로 이동 중..."
        );
        window.location.href = "login.html";
        return;
    }

    const product = products.find((product) => product.id === productId);
    if (!product) {
        alert("상품을 찾을 수 없습니다.");
        return; // Exit if product not found
    }

    // Check if the product is already in the cart
    if (user.cart[productId]) {
        user.cart[productId] += 1; // Increment quantity
        alert(
            `${product.name}의 수량이 증가되었습니다. 수량 : ${user.cart[productId]}`
        );
    } else {
        user.cart[productId] = 1; // Add to cart with quantity 1
        alert(`${product.name}이 카트에 추가되었습니다. 수량 : 1`);
    }

    // Update user in session storage
    const users = JSON.parse(sessionStorage.getItem("users"));
    const userIndex = users.findIndex((u) => u.userId === user.userId);
    if (userIndex !== -1) {
        users[userIndex] = user;
        sessionStorage.setItem("users", JSON.stringify(users));
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    }
}

// Render the products in the DOM
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
                    ? `<button class="delete-button" onclick="deleteProduct(${product.id})">X</button>`
                    : ""
            }
        `;

        productGrid.appendChild(productCard);
    });
}

// Load and render products on page load
window.onload = function () {
    products = loadProducts();
    if (isAdmin()) {
        document.getElementById("addProductForm").style.display = "block";
    } else {
        document.getElementById("addProductForm").style.display = "none";
    }
    renderProducts();
};
